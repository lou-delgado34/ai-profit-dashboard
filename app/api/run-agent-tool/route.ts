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
    const { agentId, tool, input } = await req.json();

    const { data: agent, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (error || !agent) {
      throw new Error("Agent not found.");
    }

    const { data: memory } = await supabase
      .from("agent_memory")
      .select("title, content")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(20);

    const memoryText =
      memory && memory.length > 0
        ? memory
            .map((item) => `- ${item.title}: ${item.content}`)
            .join("\n")
        : "No saved memory yet.";

    const toolInstructions: Record<string, string> = {
      dm_writer:
        "Write a friendly DM. Make it natural, simple, and not pushy.",
      follow_up_writer:
        "Write a follow-up message. Make it warm, short, and clear.",
      objection_handler:
        "Help handle the objection in a calm, educational way.",
      appointment_script:
        "Create a simple appointment booking script that moves the person to a Zoom or call.",
      recruiting_script:
        "Create a recruiting message for someone interested in extra income or a business opportunity.",
      content_post:
        "Create a short social media post with a strong hook and CTA.",
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are this Superagent:

Name: ${agent.name}
Role: ${agent.role}

Instructions:
${agent.instructions}

Saved Memory:
${memoryText}

Tool being used:
${tool}

Tool goal:
${toolInstructions[tool] || "Help the user complete the task."}

Rules:
- Stay in character as this agent.
- Use saved memory when helpful.
- Keep it practical and ready to copy.
- If this involves financial services, stay compliant and educational.
- Do not promise results, income, approvals, or guaranteed outcomes.
- Do not say you sent messages or booked appointments. Only draft the content.
`,
        },
        {
          role: "user",
          content: input || "Create the best output for this tool.",
        },
      ],
    });

    const output =
      completion.choices[0]?.message?.content ||
      "No tool output created.";

    await supabase.from("agent_messages").insert({
      agent_id: agentId,
      role: "assistant",
      content: `TOOL USED: ${tool}\n\n${output}`,
    });

    return NextResponse.json({
      output,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Agent tool failed.",
      },
      {
        status: 500,
      }
    );
  }
}