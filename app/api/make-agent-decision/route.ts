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
    const { situation } = await req.json();

    const { data: agents } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: chains } = await supabase
      .from("agent_chains")
      .select("*")
      .order("created_at", { ascending: false });

    const agentList =
      agents?.map((a) => `Agent: ${a.name}\nRole: ${a.role}\nInstructions: ${a.instructions}`).join("\n\n") ||
      "No agents found.";

    const chainList =
      chains?.map((c) => `Chain ID: ${c.id}\nChain: ${c.name}\nGoal: ${c.chain_goal}`).join("\n\n") ||
      "No chains found.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are the Superagent Decision Brain.

Your job:
- Review the user's situation.
- Pick the best agent or chain.
- Explain the next best action.
- Keep it practical.
- For financial services, stay compliant and educational.
- Do not claim you sent messages, booked appointments, or performed real-world actions.

Available Agents:
${agentList}

Available Chains:
${chainList}

Return this format:

# DECISION
Best next move.

# BEST AGENT OR CHAIN
Name the best agent or chain.

# WHY
Explain why.

# ACTION PLAN
Give 3-5 simple steps.

# READY-TO-COPY OUTPUT
Create the actual message/script/content the user can use.
`,
        },
        {
          role: "user",
          content: situation,
        },
      ],
    });

    const recommendation =
      completion.choices[0]?.message?.content ||
      "No decision created.";

    const selectedChain =
      chains?.find((chain) =>
        recommendation.toLowerCase().includes(chain.name.toLowerCase())
      ) || null;

    await supabase.from("agent_decisions").insert({
      situation,
      recommendation,
      selected_chain_id: selectedChain?.id || null,
    });

    return NextResponse.json({
      recommendation,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Decision brain failed." },
      { status: 500 }
    );
  }
}