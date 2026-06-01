import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function safeText(value: any) {
  return typeof value === "string" ? value : "";
}

async function askOpenAI(systemPrompt: string, userPrompt: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  return completion.choices[0]?.message?.content || "";
}

async function createManagerPlan(goal: string, agents: any[]) {
  const agentList = agents
    .map(
      (agent) => `
Agent Name: ${agent.name}
Role: ${agent.role}
Instructions: ${agent.instructions}
`
    )
    .join("\n");

  const systemPrompt = `
You are Lou, the Manager Agent for Team Avengers.

Your job:
Create a clear project plan and assign one specific task to each available agent.

Rules:
- Use ONLY the agents provided.
- Assign each agent one task that fits their role.
- Keep all financial services language compliant.
- Do not promise income, approvals, financial results, or guaranteed outcomes.
- If term life insurance is mentioned, keep it educational.
- Return JSON only.
- Do not add markdown.
- Do not wrap JSON in code fences.

Return this exact JSON structure:

{
  "projectPlan": "Short plain English project plan.",
  "tasks": [
    {
      "agentName": "Agent name here",
      "agentRole": "Agent role here",
      "taskTitle": "Short task title",
      "taskDescription": "Clear task instructions"
    }
  ]
}
`;

  const userPrompt = `
User Goal:
${goal}

Available Agents:
${agentList}

Create the delegation plan now.
`;

  const text = await askOpenAI(systemPrompt, userPrompt);

  try {
    return JSON.parse(text);
  } catch {
    return {
      projectPlan:
        "Manager plan could not be parsed as JSON, so each agent will receive a role-based task.",
      tasks: agents.map((agent) => ({
        agentName: agent.name,
        agentRole: agent.role,
        taskTitle: `${agent.role} contribution`,
        taskDescription: `Use your role as ${agent.role} to help complete this goal: ${goal}`,
      })),
    };
  }
}

async function runAssignedAgent({
  agent,
  task,
  memories,
  goal,
  projectPlan,
}: {
  agent: any;
  task: any;
  memories: any[];
  goal: string;
  projectPlan: string;
}) {
  const memoryText =
    memories.length === 0
      ? "No saved memory yet."
      : memories
          .map(
            (memory) =>
              `Memory Title: ${memory.memory_title}\nMemory: ${memory.memory_content}`
          )
          .join("\n\n");

  const systemPrompt = `
You are a custom business AI agent.

Agent Name:
${agent.name}

Agent Role:
${agent.role}

Agent Instructions:
${agent.instructions}

Saved Agent Memory:
${memoryText}

Manager Project Plan:
${projectPlan}

Your Assigned Task:
${task.taskTitle}

Task Instructions:
${task.taskDescription}

Rules:
- Do ONLY your assigned task.
- Do not complete other agents' tasks.
- Keep the output practical and ready to use.
- Keep financial services language compliant.
- Do not promise income, approvals, financial results, or guaranteed outcomes.
- If discussing term life insurance, keep it educational and simple.
- If your work should be saved as a business asset, include a section called TOOL OUTPUT.
`;

  const userPrompt = `
User Goal:
${goal}

Complete your assigned task now.
`;

  return askOpenAI(systemPrompt, userPrompt);
}

async function assembleFinalPackage({
  goal,
  projectPlan,
  taskResults,
}: {
  goal: string;
  projectPlan: string;
  taskResults: any[];
}) {
  const allOutputs = taskResults
    .map(
      (item) => `
Agent: ${item.agentName}
Role: ${item.agentRole}
Task: ${item.taskTitle}
Output:
${item.output}
`
    )
    .join("\n\n");

  const systemPrompt = `
You are Lou, the Manager Agent.

Your job:
Review all agent outputs and combine them into one clean final business package.

Rules:
- Keep it organized.
- Keep it useful.
- Use simple English.
- Keep compliance-friendly language.
- Do not promise income, approvals, returns, or guaranteed outcomes.
- Use headings.
`;

  const userPrompt = `
User Goal:
${goal}

Project Plan:
${projectPlan}

Agent Outputs:
${allOutputs}

Create the final business package now.
`;

  return askOpenAI(systemPrompt, userPrompt);
}

function extractToolOutput(agentName: string, output: string) {
  const hasToolOutput = output.toLowerCase().includes("tool output");

  if (!hasToolOutput) return null;

  return {
    agentName,
    toolName: "Tool Output Saver",
    outputTitle: `${agentName} Delegated Output`,
    outputContent: output,
  };
}

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: "Missing goal." }, { status: 400 });
    }

    const { data: agents, error: agentsError } = await supabase
      .from("custom_agents")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (agentsError) throw agentsError;

    if (!agents || agents.length === 0) {
      return NextResponse.json(
        { error: "No custom agents found. Create at least one custom agent first." },
        { status: 400 }
      );
    }

    const { data: memories, error: memoriesError } = await supabase
      .from("agent_memories")
      .select("*")
      .order("created_at", { ascending: true });

    if (memoriesError) throw memoriesError;

    const managerPlan = await createManagerPlan(goal, agents);
    const projectPlan = safeText(managerPlan.projectPlan);
    const tasks = Array.isArray(managerPlan.tasks) ? managerPlan.tasks : [];

    const { data: run, error: runError } = await supabase
      .from("superagent_runs")
      .insert({
        user_goal: goal,
        status: "running",
        manager_output: projectPlan,
        final_output: "SuperAgent delegation started.",
      })
      .select("*")
      .single();

    if (runError) throw runError;

    const taskResults = [];

    for (const agent of agents) {
      const matchingTask =
        tasks.find(
          (task: any) =>
            safeText(task.agentName).toLowerCase() ===
            safeText(agent.name).toLowerCase()
        ) ||
        tasks.find(
          (task: any) =>
            safeText(task.agentRole).toLowerCase() ===
            safeText(agent.role).toLowerCase()
        ) || {
          agentName: agent.name,
          agentRole: agent.role,
          taskTitle: `${agent.role} contribution`,
          taskDescription: `Use your role as ${agent.role} to help complete this goal: ${goal}`,
        };

      const agentMemories = (memories || []).filter(
        (memory) => memory.agent_id === agent.id
      );

      const output = await runAssignedAgent({
        agent,
        task: matchingTask,
        memories: agentMemories,
        goal,
        projectPlan,
      });

      const { data: taskRow } = await supabase
        .from("agent_tasks")
        .insert({
          run_id: run.id,
          agent_id: agent.id,
          agent_name: agent.name,
          agent_role: agent.role,
          task_title: matchingTask.taskTitle,
          task_description: matchingTask.taskDescription,
          output,
          status: "completed",
        })
        .select("*")
        .single();

      taskResults.push({
        agentName: agent.name,
        agentRole: agent.role,
        taskTitle: matchingTask.taskTitle,
        taskDescription: matchingTask.taskDescription,
        output,
        taskId: taskRow?.id,
      });
    }

    const finalPackage = await assembleFinalPackage({
      goal,
      projectPlan,
      taskResults,
    });

    const finalOutput = `
# SUPERAGENT DELEGATED RESULT

## MANAGER PROJECT PLAN

${projectPlan}

--------------------------------

## ASSIGNED TASKS

${taskResults
  .map(
    (item) => `### ${item.agentName} (${item.agentRole})

Task:
${item.taskTitle}

Instructions:
${item.taskDescription}

Output:
${item.output}
`
  )
  .join("\n\n")}

--------------------------------

## FINAL BUSINESS PACKAGE

${finalPackage}
`;

    await supabase
      .from("superagent_runs")
      .update({
        status: "completed",
        manager_output: projectPlan,
        marketing_output: taskResults[0]?.output || "",
        email_output: taskResults[1]?.output || "",
        funnel_output: taskResults[2]?.output || "",
        crm_output: taskResults[3]?.output || "",
        final_output: finalOutput,
      })
      .eq("id", run.id);

    const toolOutputs = taskResults
      .map((item) => extractToolOutput(item.agentName, item.output))
      .filter(Boolean);

    for (const output of toolOutputs as any[]) {
      await supabase.from("agent_tool_outputs").insert({
        run_id: run.id,
        agent_name: output.agentName,
        tool_name: output.toolName,
        output_title: output.outputTitle,
        output_content: output.outputContent,
      });
    }

    const shouldCreateCampaign =
      goal.toLowerCase().includes("campaign") ||
      goal.toLowerCase().includes("recruiting") ||
      goal.toLowerCase().includes("content");

    if (shouldCreateCampaign) {
      await supabase.from("campaigns").insert({
        title: goal.slice(0, 90),
        campaign_type: goal.toLowerCase().includes("recruit")
          ? "recruiting"
          : "marketing",
        content: finalOutput,
        status: "draft",
      });
    }

    return NextResponse.json({
      success: true,
      run: {
        ...run,
        status: "completed",
        final_output: finalOutput,
      },
      projectPlan,
      tasks: taskResults,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "SuperAgent delegation failed." },
      { status: 500 }
    );
  }
}