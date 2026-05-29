import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Missing appointmentId." },
        { status: 400 }
      );
    }

    const { data: appointment } = await supabase
      .from("crm_appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    await supabase
      .from("crm_appointments")
      .update({
        reminder_sent: true,
        reminder_status: "sent",
      })
      .eq("id", appointmentId);

    await supabase
      .from("crm_appointment_reminders")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("appointment_id", appointmentId);

    await supabase.from("crm_lead_activities").insert({
      lead_id: appointment.lead_id,
      activity_type: "appointment_reminder_sent",
      note: "Appointment reminder marked as sent.",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Could not mark reminder sent." },
      { status: 500 }
    );
  }
}