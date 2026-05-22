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
    const { chainId, input } = await req.json();

    const { data: chain, error: chainError } = await supabase
      .from("agent_chains")
      .select("*")
      .eq("id", chainId)
      .single();

    if (chainError || !chain) {
      throw new Error("Chain not found.");
    }

    const { data: mainAgent, error: mainError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", chain.main_agent_id)
      .single();

    if (mainError || !mainAgent) {
      throw new Error("Main agent not found.");
    }

    const { data: helperAgent, error: helperError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", chain.helper_agent_id)
      .single();

    if (helperError || !helperAgent) {
      throw new Error("Helper agent not found.");
    }

    const helperCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are the helper agent in a multi-agent chain.

Helper Agent Name:
${helperAgent.name}

Helper Agent Role:
${helperAgent.role}

Helper Agent Instructions:
${helperAgent.instructions}

Chain Goal:
${chain.chain_goal}

Your job:
Complete your part first and give your best output to the main agent.

Rules:
- Be clear.
- Be practical.
- Do not claim you sent messages, booked appointments, or took real-world actions.
- For financial services, stay compliant and educational.
`,
        },
        {
          role: "user",
          content: input || "Run your helper-agent part of this chain.",
        },
      ],
    });

    const helperOutput =
      helperCompletion.choices[0]?.message?.content ||
      "No helper output.";

    const mainCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are the main agent in a multi-agent chain.

Main Agent Name:
${mainAgent.name}

Main Agent Role:
${mainAgent.role}

Main Agent Instructions:
${mainAgent.instructions}

Chain Goal:
${chain.chain_goal}

Helper Agent Output:
${helperOutput}

Your job:
Use the helper agent's output to create the final answer.

Rules:
- Show what the helper agent contributed.
- Create the final improved output.
- Give next action steps.
- Do not claim you sent messages, booked appointments, or took real-world actions.
- For financial services, stay compliant and educational.
`,
        },
        {
          role: "user",
          content: input || "Use the helper agent output and finish the chain.",
        },
      ],
    });

    const finalOutput =
      mainCompletion.choices[0]?.message?.content ||
      "No final chain output.";

    const fullOutput = `
# HELPER AGENT OUTPUT

${helperOutput}

# FINAL MAIN AGENT OUTPUT

${finalOutput}
`;

    await supabase.from("agent_chain_runs").insert({
      chain_id: chainId,
      input,
      output: fullOutput,
    });

    return NextResponse.json({
      output: fullOutput,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Agent chain failed." },
      { status: 500 }
    );
  }
}