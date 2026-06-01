import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { agentId, memoryTitle, memoryContent } = await req.json();

    if (!agentId || !memoryTitle || !memoryContent) {
      return NextResponse.json(
        { error: "Missing agentId, memoryTitle, or memoryContent." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("agent_memories")
      .insert({
        agent_id: agentId,
        memory_title: memoryTitle,
        memory_content: memoryContent,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, memory: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not create memory." },
      { status: 500 }
    );
  }
}