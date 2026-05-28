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
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId." }, { status: 400 });
    }

    const logs = [
      log("Follow-up automation sequence started."),
      log("Step 1 created: immediate welcome follow-up."),
      log("Step 2 created: 24-hour appointment reminder."),
      log("Step 3 created: final educational follow-up."),
    ];

    const { data: sequence, error } = await supabase
      .from("crm_automation_sequences")
      .insert({
        lead_id: leadId,
        sequence_name: "3-Step Term Life Follow-Up",
        status: "active",
        current_step: 1,
        logs,
      })
      .select("*")
      .single();

    if (error) throw error;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thirdDay = new Date(now);
    thirdDay.setDate(thirdDay.getDate() + 3);

    await supabase.from("crm_tasks").insert([
      {
        lead_id: leadId,
        task_type: "follow_up",
        title: "Send welcome follow-up",
        description: "Send first friendly follow-up and invite to book a conversation.",
        due_at: now.toISOString(),
        priority: "high",
      },
      {
        lead_id: leadId,
        task_type: "appointment_reminder",
        title: "24-hour appointment reminder",
        description: "Follow up if appointment has not been booked.",
        due_at: tomorrow.toISOString(),
        priority: "normal",
      },
      {
        lead_id: leadId,
        task_type: "education",
        title: "Final educational follow-up",
        description: "Send educational income protection message.",
        due_at: thirdDay.toISOString(),
        priority: "normal",
      },
    ]);

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "automation_sequence_started",
      note: "3-step term life follow-up sequence started.",
    });

    return NextResponse.json({ success: true, sequence });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not start follow-up sequence." },
      { status: 500 }
    );
  }
}