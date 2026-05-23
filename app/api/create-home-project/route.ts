import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please describe the app you want to build." },
        { status: 400 }
      );
    }

    const title =
      prompt.length > 70 ? prompt.slice(0, 70).trim() + "..." : prompt.trim();

    const { data, error } = await supabase
      .from("app_projects")
      .insert({
        title,
        prompt: prompt.trim(),
        status: "draft",
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      project: data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not create project." },
      { status: 500 }
    );
  }
}