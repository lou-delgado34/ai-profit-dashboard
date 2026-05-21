import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const { data: original, error } = await supabase
      .from("app_projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !original) {
      throw new Error("Original project not found.");
    }

    const { data: copy, error: insertError } = await supabase
      .from("app_projects")
      .insert({
        title: `${original.title} Copy`,
        prompt: original.prompt,
        result: original.result,
        status: original.status || "generated",
        project_status: "draft",
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      projectId: copy.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not duplicate project." },
      { status: 500 }
    );
  }
}