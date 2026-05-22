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

export async function POST(req: Request) {
  try {
    const { workflowId, input } = await req.json();

    const { data: workflow, error: workflowError } = await supabase
      .from("agent_workflows")
      .select("*")
      .eq("id", workflowId)
      .single();

    if (workflowError || !workflow) throw new Error("Workflow not found.");

    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", workflow.agent_id)
      .single();

    if (agentError || !agent) throw new Error("Agent not found.");

    const { data: memory } = await supabase
      .from("agent_memory")
      .select("title, content")
      .eq("agent_id", agent.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const memoryText =
      memory && memory.length > 0
        ? memory.map((m) => `- ${m.title}: ${m.content}`).join("\n")
        : "No saved memory.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are this Superagent:

Name: ${agent.name}
Role: ${agent.role}
Instructions: ${agent.instructions}

Saved Memory:
${memoryText}

You are running a workflow.

Workflow Name:
${workflow.name}

Workflow Description:
${workflow.description || "No description"}

Workflow Steps:
${workflow.steps}

Rules:
- Follow the workflow steps in order.
- Show each step clearly.
- Create practical outputs.
- Do not claim you sent emails, texts, or booked appointments.
- You may draft messages, scripts, plans, and next actions.
- Stay compliant and educational for financial services.
`,
        },
        {
          role: "user",
          content: input || "Run this workflow now.",
        },
      ],
    });

    const output =
      completion.choices[0]?.message?.content || "No workflow output.";

    await supabase.from("agent_workflow_runs").insert({
      workflow_id: workflowId,
      agent_id: agent.id,
      input,
      output,
    });

    return NextResponse.json({ output });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Workflow failed." },
      { status: 500 }
    );
  }
}