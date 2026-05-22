import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const {
      name,
      description,
      mainAgentId,
      helperAgentId,
      chainGoal,
    } = await req.json();

    const { error } = await supabase.from("agent_chains").insert({
      name,
      description,
      main_agent_id: mainAgentId,
      helper_agent_id: helperAgentId,
      chain_goal: chainGoal,
      status: "draft",
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not create agent chain." },
      { status: 500 }
    );
  }
}