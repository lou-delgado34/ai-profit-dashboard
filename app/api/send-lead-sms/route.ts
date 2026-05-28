import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function saveCommunication({
  leadId,
  message,
  status,
  providerId,
  errorMessage,
}: {
  leadId: string;
  message: string;
  status: string;
  providerId?: string;
  errorMessage?: string;
}) {
  await supabase.from("crm_communications").insert({
    lead_id: leadId,
    channel: "sms",
    message,
    status,
    provider_id: providerId || null,
    error_message: errorMessage || null,
  });

  await supabase.from("crm_lead_activities").insert({
    lead_id: leadId,
    activity_type: status === "sent" ? "sms_sent" : "sms_failed",
    note:
      status === "sent"
        ? "SMS sent successfully."
        : `SMS failed: ${errorMessage}`,
  });
}

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId." }, { status: 400 });
    }

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const normalFrom = process.env.TWILIO_PHONE_NUMBER;
    const whatsappFrom =
      process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

    if (!sid || !token) {
      return NextResponse.json(
        { error: "Twilio SID or token is missing." },
        { status: 400 }
      );
    }

    const { data: lead } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const message = lead.sms_draft || lead.follow_up_message || "";

    if (!message) {
      await saveCommunication({
        leadId,
        message,
        status: "failed",
        errorMessage: "SMS message is missing. Click SMS + Email Drafts first.",
      });

      return NextResponse.json(
        { error: "SMS message is missing. Click SMS + Email Drafts first." },
        { status: 400 }
      );
    }

    if (!lead.phone) {
      await saveCommunication({
        leadId,
        message,
        status: "failed",
        errorMessage: "Lead phone number is missing.",
      });

      return NextResponse.json(
        { error: "Lead phone number is missing." },
        { status: 400 }
      );
    }

    const isWhatsApp = lead.phone.startsWith("whatsapp:");

    const from = isWhatsApp ? whatsappFrom : normalFrom;
    const to = isWhatsApp ? lead.phone : lead.phone;

    if (!from) {
      return NextResponse.json(
        { error: "Twilio FROM number is missing." },
        { status: 400 }
      );
    }

    if (!isWhatsApp && !to.startsWith("+")) {
      return NextResponse.json(
        { error: "Phone must include country code. Example: +13219782393" },
        { status: 400 }
      );
    }

    const client = twilio(sid, token);

    const result = await client.messages.create({
      body: message,
      from,
      to,
    });

    await saveCommunication({
      leadId,
      message,
      status: "sent",
      providerId: result.sid,
    });

    return NextResponse.json({
      success: true,
      providerId: result.sid,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not send SMS." },
      { status: 500 }
    );
  }
}