import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { agentId, title, content } = await req.json();

    const { error } = await supabase
      .from("agent_memory")
      .insert({
        agent_id: agentId,
        title,
        content,
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not save memory." },
      { status: 500 }
    );
  }
}