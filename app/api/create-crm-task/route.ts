import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId, taskType, title, description, dueAt, priority } =
      await req.json();

    if (!leadId || !taskType || !title) {
      return NextResponse.json(
        { error: "Missing leadId, taskType, or title." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("crm_tasks")
      .insert({
        lead_id: leadId,
        task_type: taskType,
        title,
        description,
        due_at: dueAt || null,
        priority: priority || "normal",
        status: "pending",
      })
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "task_created",
      note: `Task created: ${title}`,
    });

    return NextResponse.json({ success: true, task: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not create task." },
      { status: 500 }
    );
  }
}