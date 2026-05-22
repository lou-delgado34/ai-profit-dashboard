import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { agentId, actionType, title, content } = await req.json();

    const { error } = await supabase.from("agent_actions").insert({
      agent_id: agentId,
      action_type: actionType,
      title,
      content,
      status: "pending",
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not create action." },
      { status: 500 }
    );
  }
}