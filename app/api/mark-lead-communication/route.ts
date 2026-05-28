import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId, channel, message } = await req.json();

    if (!leadId || !channel) {
      return NextResponse.json(
        { error: "Missing leadId or channel." },
        { status: 400 }
      );
    }

    await supabase.from("crm_communications").insert({
      lead_id: leadId,
      channel,
      message: message || "",
      status: "sent",
    });

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: `${channel}_sent`,
      note: `${channel.toUpperCase()} marked as sent.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not mark communication." },
      { status: 500 }
    );
  }
}