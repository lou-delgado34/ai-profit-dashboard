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
    const { agentId, message, language } = await req.json();

    const outputLanguage =
      language === "es"
        ? "Spanish. Reply only in Spanish."
        : "English. Reply only in English.";

    if (!agentId || !message) {
      return NextResponse.json(
        { error: "Missing agentId or message." },
        { status: 400 }
      );
    }

    const { data: agent, error: agentError } = await supabase
      .from("custom_agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    const { data: memories } = await supabase
      .from("agent_memories")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: true });

    const { data: knowledge } = await supabase
      .from("knowledge_base")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: recentChats } = await supabase
      .from("agent_chats")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(8);

    const memoryText =
      !memories || memories.length === 0
        ? "No saved memory yet."
        : memories
            .map((memory) => `${memory.memory_title}: ${memory.memory_content}`)
            .join("\n");

    const knowledgeText =
      !knowledge || knowledge.length === 0
        ? "No knowledge base available."
        : knowledge
            .map(
              (item) =>
                `Knowledge Title: ${item.title}\nCategory: ${item.category}\nContent:\n${item.content}`
            )
            .join("\n\n---\n\n");

    const chatHistory =
      !recentChats || recentChats.length === 0
        ? "No recent chat history."
        : recentChats
            .reverse()
            .map(
              (chat) =>
                `User: ${chat.user_message}\n${agent.name}: ${chat.agent_response}`
            )
            .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a custom business AI agent.

Output Language:
${outputLanguage}

Agent Name:
${agent.name}

Agent Role:
${agent.role}

Agent Instructions:
${agent.instructions}

Agent Tools:
${(agent.tools || []).join(", ") || "No tools listed."}

Saved Agent Memory:
${memoryText}

Team Knowledge Base:
${knowledgeText}

Recent Chat History:
${chatHistory}

Rules:
- Answer as this specific agent.
- Stay in your role.
- Use the knowledge base when helpful.
- Use memory when helpful.
- Keep answers clear and ready to use.
- Keep financial services content compliant.
- Do not promise income, approvals, returns, results, or guarantees.
- If discussing term life insurance, keep it educational and simple.
- Follow the Output Language exactly.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "I could not generate a response.";

    const { data: savedChat, error: saveError } = await supabase
      .from("agent_chats")
      .insert({
        agent_id: agent.id,
        agent_name: agent.name,
        user_message: message,
        agent_response: reply,
      })
      .select("*")
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({
      success: true,
      reply,
      chat: savedChat,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Agent chat failed." },
      { status: 500 }
    );
  }
}