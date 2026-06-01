import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function ask(system: string, user: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0]?.message?.content || "";
}

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: "Missing goal." }, { status: 400 });
    }

    const { data: agents } = await supabase
      .from("custom_agents")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (!agents || agents.length === 0) {
      return NextResponse.json(
        { error: "Create custom agents first." },
        { status: 400 }
      );
    }

    const { data: memories } = await supabase
      .from("agent_memories")
      .select("*");

    const agentList = agents
      .map((a) => `${a.name} — ${a.role}\n${a.instructions}`)
      .join("\n\n");

    const managerPlan = await ask(
      `
You are Lou, the SuperAgent Manager.

Create a clear delegation plan for the user's goal.

Rules:
- Use the agents provided.
- Assign each agent a specific job.
- Keep it compliant.
- No income promises.
- No guaranteed results.
- Return a simple readable plan.
`,
      `
Goal:
${goal}

Agents:
${agentList}
`
    );

    const taskResults: any[] = [];

    for (const agent of agents) {
      const agentMemories = (memories || [])
        .filter((m) => m.agent_id === agent.id)
        .map((m) => `${m.memory_title}: ${m.memory_content}`)
        .join("\n");

      const taskOutput = await ask(
        `
You are ${agent.name}.

Role:
${agent.role}

Instructions:
${agent.instructions}

Memory:
${agentMemories || "No memory yet."}

Manager Plan:
${managerPlan}

Rules:
- Do only your specialist part.
- Do not do every agent's job.
- Make your output usable.
- Keep it compliant.
- No income guarantees or promised results.
`,
        `
User Goal:
${goal}

Complete your assigned part.
`
      );

      taskResults.push({
        agentId: agent.id,
        agentName: agent.name,
        agentRole: agent.role,
        output: taskOutput,
      });
    }

    const taskSummary = taskResults
      .map(
        (t) => `
${t.agentName} (${t.agentRole})
${t.output}
`
      )
      .join("\n\n---\n\n");

    const finalPackage = await ask(
      `
You are Lou, the SuperAgent Manager.

Combine all agent work into one polished business package.

Use sections:
1. Executive Summary
2. Campaign Strategy
3. Copy Assets
4. Email Assets
5. Funnel Assets
6. Design Direction
7. CRM Follow-Up Plan
8. Next Steps

Keep it clean, useful, and compliant.
`,
      `
Goal:
${goal}

Manager Plan:
${managerPlan}

Agent Work:
${taskSummary}
`
    );

    const finalOutput = `
# SUPERAGENT MANAGER RESULT

## Manager Plan

${managerPlan}

--------------------------------

## Agent Contributions

${taskSummary}

--------------------------------

## Final Business Package

${finalPackage}
`;

    const { data: run, error } = await supabase
      .from("superagent_runs")
      .insert({
        user_goal: goal,
        status: "completed",
        manager_output: managerPlan,
        manager_plan: managerPlan,
        delegated_tasks: taskResults,
        final_package: finalPackage,
        final_output: finalOutput,
        marketing_output: taskResults[0]?.output || "",
        email_output: taskResults[1]?.output || "",
        funnel_output: taskResults[2]?.output || "",
        crm_output: taskResults[3]?.output || "",
      })
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("campaigns").insert({
      title: goal.slice(0, 90),
      campaign_type: goal.toLowerCase().includes("recruit")
        ? "recruiting"
        : "marketing",
      content: finalOutput,
      status: "draft",
    });

    for (const task of taskResults) {
      await supabase.from("agent_tasks").insert({
        run_id: run.id,
        agent_id: task.agentId,
        agent_name: task.agentName,
        agent_role: task.agentRole,
        task_title: `${task.agentRole} assignment`,
        task_description: goal,
        output: task.output,
        status: "completed",
      });
    }

    return NextResponse.json({
      success: true,
      run,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Manager run failed." },
      { status: 500 }
    );
  }
}