import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId, appointmentDate, appointmentType, notes } = await req.json();

    if (!leadId || !appointmentDate) {
      return NextResponse.json({ error: "Missing leadId or appointmentDate." }, { status: 400 });
    }

    const { error } = await supabase.from("crm_appointments").insert({
      lead_id: leadId,
      appointment_date: appointmentDate,
      appointment_type: appointmentType || "Zoom",
      notes,
      status: "scheduled",
    });

    if (error) throw error;

    await supabase
      .from("crm_leads")
      .update({ stage: "appointment_ready", updated_at: new Date().toISOString() })
      .eq("id", leadId);

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "appointment",
      note: `Appointment scheduled for ${appointmentDate}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not create appointment." }, { status: 500 });
  }
}