import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      leadId,
      title,
      appointmentDate,
      appointmentTime,
      notes,
    } = body;

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          lead_id: leadId,
          title,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          notes,
          status: "scheduled",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    await supabase.from("crm_activities").insert([
      {
        lead_id: leadId,
        type: "appointment_booked",
        description: `Appointment booked for ${appointmentDate} at ${appointmentTime}`,
      },
    ]);

    return NextResponse.json({
      success: true,
      appointment: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}