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
    const { agentId, message } = await req.json();

    if (!agentId || !message) {
      return NextResponse.json(
        { error: "Missing agentId or message." },
        { status: 400 }
      );
    }

    const { data: agent } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    const { data: history } = await supabase
      .from("agent_messages")
      .select("role, content")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: true })
      .limit(20);

    await supabase.from("agent_messages").insert({
      agent_id: agentId,
      role: "user",
      content: message,
    });

    const safeHistory =
      history?.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      })) || [];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a Superagent inside Lou's AI Profit Dashboard.

Agent Name: ${agent.name}
Agent Role: ${agent.role}
Agent Instructions: ${agent.instructions}

Rules:
- Be helpful, simple, and clear.
- If helping with financial services, stay educational and compliant.
- Do not promise approvals, income, investment results, guaranteed savings, or guaranteed outcomes.
- Help move the user toward the next best action.
`,
        },
        ...(safeHistory as any),
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content || "No response created.";

    await supabase.from("agent_messages").insert({
      agent_id: agentId,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Agent chat failed." },
      { status: 500 }
    );
  }
}