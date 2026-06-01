import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { agentId, name, role, instructions, tools } = await req.json();

    if (!agentId || !name || !role || !instructions) {
      return NextResponse.json(
        { error: "Missing agentId, name, role, or instructions." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("custom_agents")
      .update({
        name,
        role,
        instructions,
        tools: tools || [],
      })
      .eq("id", agentId)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, agent: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not update agent." },
      { status: 500 }
    );
  }
}