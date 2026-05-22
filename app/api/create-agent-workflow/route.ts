import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { agentId, name, description, steps } = await req.json();

    const { error } = await supabase.from("agent_workflows").insert({
      agent_id: agentId,
      name,
      description,
      steps,
      status: "draft",
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not create workflow." },
      { status: 500 }
    );
  }
}