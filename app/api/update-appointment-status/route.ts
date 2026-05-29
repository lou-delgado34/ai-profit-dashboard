import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { appointmentId, status } = await req.json();

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Missing appointmentId or status." },
        { status: 400 }
      );
    }

    const { data: appointment, error } = await supabase
      .from("crm_appointments")
      .update({ status })
      .eq("id", appointmentId)
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: appointment.lead_id,
      activity_type: "appointment_status_updated",
      note: `Appointment status updated to: ${status}`,
    });

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Could not update appointment status." },
      { status: 500 }
    );
  }
}