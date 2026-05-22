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
    const { agentId, phone, purpose, context } = await req.json();

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

Create a short SMS text message.

Rules:
- Keep it under 300 characters.
- Sound natural, friendly, and human.
- Do NOT say the message was sent.
- If financial services, stay compliant and educational.
- Do not promise approvals, income, savings, guarantees, or results.
- Focus on booking a conversation, answering questions, or following up.

Return only the SMS message text.
`,
        },
        {
          role: "user",
          content: `
Phone: ${phone || "Not provided"}
Purpose: ${purpose}
Context: ${context}
`,
        },
      ],
    });

    const draft =
      completion.choices[0]?.message?.content || "No SMS draft created.";

    const { error: actionError } = await supabase.from("agent_actions").insert({
      agent_id: agentId,
      action_type: "sms_draft",
      title: `SMS Draft: ${purpose}`,
      content: `PHONE: ${phone || "Add phone number"}\n\nMESSAGE:\n${draft}`,
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
      { error: "Could not create SMS draft." },
      { status: 500 }
    );
  }
}