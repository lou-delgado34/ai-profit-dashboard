import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { triggerId, input } = await req.json();

    const { data: trigger, error } = await supabase
      .from("agent_triggers")
      .select("*")
      .eq("id", triggerId)
      .single();

    if (error || !trigger) {
      throw new Error("Trigger not found.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/run-agent-chain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId: trigger.chain_id,
          input,
        }),
      }
    );

    const data = await response.json();

    await supabase.from("agent_trigger_runs").insert({
      trigger_id: triggerId,
      input,
      output: data.output || "No output",
    });

    return NextResponse.json({
      output: data.output,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Trigger failed." },
      { status: 500 }
    );
  }
}