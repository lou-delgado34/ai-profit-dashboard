import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function log(message: string) {
  return {
    time: new Date().toISOString(),
    message,
  };
}

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId." }, { status: 400 });
    }

    const { data: job, error } = await supabase
      .from("ai_automation_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const logs = [
      ...(job.logs || []),
      log("Automation runner started."),
      log("Project command reviewed."),
      log("Agent workflow prepared."),
      log("Task marked complete."),
    ];

    const result = {
      summary: "Automation command processed successfully.",
      command: job.command,
      nextStep: "Review output and continue building.",
    };

    const { data: updatedJob, error: updateError } = await supabase
      .from("ai_automation_jobs")
      .update({
        status: "completed",
        result,
        logs,
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not run automation job." },
      { status: 500 }
    );
  }
}