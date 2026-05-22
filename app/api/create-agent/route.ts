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
      role,
      instructions,
      trigger_type,
      tools,
    } = await req.json();

    const { data, error } = await supabase
      .from("agents")
      .insert({
        name,
        role,
        instructions,
        trigger_type: trigger_type || "manual",
        tools: tools || [],
        status: "draft",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      agentId: data.id,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not create agent." },
      { status: 500 }
    );
  }
}