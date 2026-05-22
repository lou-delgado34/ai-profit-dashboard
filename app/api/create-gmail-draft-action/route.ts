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
    const { agentId, recipient, purpose, context } = await req.json();

    const { data: agent, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (error || !agent) throw new Error("Agent not found.");

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

Create a Gmail email draft.

Rules:
- Do NOT claim the email was sent.
- Create a subject line.
- Create a professional email body.
- Keep it friendly and clear.
- If financial services, stay compliant and educational.
- Do not promise approvals, income, guarantees, or results.

Return exactly:

SUBJECT:
...

BODY:
...
`,
        },
        {
          role: "user",
          content: `
Recipient: ${recipient || "Not provided"}
Purpose: ${purpose}
Context: ${context}
`,
        },
      ],
    });

    const draft =
      completion.choices[0]?.message?.content || "No draft created.";

    const { error: actionError } = await supabase.from("agent_actions").insert({
      agent_id: agentId,
      action_type: "gmail_draft",
      title: `Gmail Draft: ${purpose}`,
      content: `TO: ${recipient || "Add recipient"}\n\n${draft}`,
      status: "pending",
    });

    if (actionError) throw actionError;

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not create Gmail draft." },
      { status: 500 }
    );
  }
}