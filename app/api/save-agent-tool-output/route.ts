import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { runId, agentName, toolName, outputTitle, outputContent } =
      await req.json();

    if (!toolName || !outputTitle || !outputContent) {
      return NextResponse.json(
        { error: "Missing toolName, outputTitle, or outputContent." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("agent_tool_outputs")
      .insert({
        run_id: runId || null,
        agent_name: agentName || "Unknown Agent",
        tool_name: toolName,
        output_title: outputTitle,
        output_content: outputContent,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, output: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not save tool output." },
      { status: 500 }
    );
  }
}