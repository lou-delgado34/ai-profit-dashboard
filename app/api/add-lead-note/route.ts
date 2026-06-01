import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { leadId, note } = await req.json();

  if (!leadId || !note) {
    return NextResponse.json({ error: "Missing leadId or note." }, { status: 400 });
  }

  await supabase.from("crm_lead_notes").insert({ lead_id: leadId, note });

  await supabase.from("crm_lead_activities").insert({
    lead_id: leadId,
    activity_type: "note_added",
    note,
  });

  return NextResponse.json({ success: true });
}