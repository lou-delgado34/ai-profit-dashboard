import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { title, category, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing title or content." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("knowledge_base")
      .insert({
        title,
        category: category || "general",
        content,
        status: "active",
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, item: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not save knowledge." },
      { status: 500 }
    );
  }
}