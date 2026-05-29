import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      .select("*, crm_leads(*)")
      .eq("id", appointmentId)
      .single();

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Create a short appointment reminder for a TERM LIFE insurance consultation.

Rules:
- Friendly and simple.
- No pressure.
- No promises.
- No guaranteed approval, savings, income, or results.
- Mention the appointment date/time.
- If lead language is Spanish, write Spanish.
- If English, write English.
Return only the reminder message.
`,
        },
        {
          role: "user",
          content: JSON.stringify(appointment),
        },
      ],
    });

    const message =
      completion.choices[0]?.message?.content ||
      "Quick reminder about your upcoming appointment.";

    const { error } = await supabase
      .from("crm_appointments")
      .update({
        reminder_message: message,
        reminder_status: "draft_ready",
      })
      .eq("id", appointmentId);

    if (error) throw error;

    await supabase.from("crm_appointment_reminders").insert({
      appointment_id: appointmentId,
      lead_id: appointment.lead_id,
      reminder_type: "sms",
      message,
      status: "pending",
      scheduled_for: appointment.appointment_date,
    });

    await supabase.from("crm_lead_activities").insert({
      lead_id: appointment.lead_id,
      activity_type: "appointment_reminder_created",
      note: "AI appointment reminder generated.",
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Could not generate appointment reminder." },
      { status: 500 }
    );
  }
}