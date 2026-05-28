import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId." }, { status: 400 });
    }

    const { data: task, error } = await supabase
      .from("crm_tasks")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: task.lead_id,
      activity_type: "task_completed",
      note: `Task completed: ${task.title}`,
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not complete task." },
      { status: 500 }
    );
  }
}