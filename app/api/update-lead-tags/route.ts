import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { leadId, tags } = await req.json();

  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId." }, { status: 400 });
  }

  await supabase
    .from("crm_leads")
    .update({ tags: tags || [] })
    .eq("id", leadId);

  return NextResponse.json({ success: true });
}