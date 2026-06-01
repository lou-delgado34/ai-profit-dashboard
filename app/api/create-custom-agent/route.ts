import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, role, instructions, tools } = await req.json();

    if (!name || !role || !instructions) {
      return NextResponse.json(
        { error: "Missing name, role, or instructions." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("custom_agents")
      .insert({
        name,
        role,
        instructions,
        tools: tools || [],
        status: "active",
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, agent: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not create agent." },
      { status: 500 }
    );
  }
}