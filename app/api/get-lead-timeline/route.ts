import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId." }, { status: 400 });
    }

    const { data: activities } = await supabase
      .from("crm_lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    const { data: communications } = await supabase
      .from("crm_communications")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    const { data: appointments } = await supabase
      .from("crm_appointments")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      activities: activities || [],
      communications: communications || [],
      appointments: appointments || [],
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not load timeline." },
      { status: 500 }
    );
  }
}