import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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
    channel: "email",
    message,
    status,
    provider_id: providerId || null,
    error_message: errorMessage || null,
  });

  await supabase.from("crm_lead_activities").insert({
    lead_id: leadId,
    activity_type: status === "sent" ? "email_sent" : "email_failed",
    note: status === "sent" ? "Email sent successfully." : `Email failed: ${errorMessage}`,
  });
}

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId." }, { status: 400 });
    }

    const { data: lead } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const message = lead.email_draft || lead.follow_up_message || "";

    if (!lead.email) {
      await saveCommunication({
        leadId,
        message,
        status: "failed",
        errorMessage: "Lead email is missing.",
      });

      return NextResponse.json(
        { error: "Lead email is missing." },
        { status: 400 }
      );
    }

    if (!message) {
      await saveCommunication({
        leadId,
        message,
        status: "failed",
        errorMessage: "Email message is missing.",
      });

      return NextResponse.json(
        { error: "Email message is missing." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.FROM_EMAIL;

    if (!apiKey || !from) {
      await saveCommunication({
        leadId,
        message,
        status: "failed",
        errorMessage: "Resend environment variables are missing.",
      });

      return NextResponse.json(
        { error: "Resend environment variables are missing." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from,
      to: lead.email,
      subject: "Quick follow-up",
      text: message,
    });

    await saveCommunication({
      leadId,
      message,
      status: "sent",
      providerId: result.data?.id,
    });

    return NextResponse.json({
      success: true,
      providerId: result.data?.id,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Could not send email." },
      { status: 500 }
    );
  }
}