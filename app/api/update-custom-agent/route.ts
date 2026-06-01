import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { agentId, name, role, instructions, tools, status } = await req.json();

    if (!agentId || !name || !role || !instructions) {
      return NextResponse.json(
        { error: "Missing agentId, name, role, or instructions." },
        { status: 400 }
      );
    }

    const isManager =
      name.toLowerCase() === "lou" || role.toLowerCase().includes("manager");

    const { data, error } = await supabase
      .from("custom_agents")
      .update({
        name,
        role,
        instructions,
        tools: tools || [],
        status: isManager ? "active" : status || "active",
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