import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { knowledgeId } = await req.json();

    if (!knowledgeId) {
      return NextResponse.json(
        { error: "Missing knowledgeId." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("knowledge_base")
      .delete()
      .eq("id", knowledgeId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not delete knowledge." },
      { status: 500 }
    );
  }
}