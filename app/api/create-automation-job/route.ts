import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { projectId, command } = await req.json();

    if (!projectId || !command) {
      return NextResponse.json(
        { error: "Missing projectId or command." },
        { status: 400 }
      );
    }

    const logs = [
      {
        time: new Date().toISOString(),
        message: "Automation job created.",
      },
    ];

    const { data, error } = await supabase
      .from("ai_automation_jobs")
      .insert({
        project_id: projectId,
        command,
        status: "pending",
        logs,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, job: data });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not create automation job." },
      { status: 500 }
    );
  }
}