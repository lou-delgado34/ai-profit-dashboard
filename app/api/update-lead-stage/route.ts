import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId, stage } = await req.json();

    if (!leadId || !stage) {
      return NextResponse.json({ error: "Missing leadId or stage." }, { status: 400 });
    }

    const { error } = await supabase
      .from("crm_leads")
      .update({ stage, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "stage_update",
      note: `Lead moved to stage: ${stage}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not update stage." }, { status: 500 });
  }
}