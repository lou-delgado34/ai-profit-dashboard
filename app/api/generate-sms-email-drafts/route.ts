import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();

    const { data: lead } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Return ONLY valid JSON:
{
  "sms": "",
  "email": ""
}

Create compliant TERM LIFE insurance follow-up drafts.

Rules:
- Friendly and simple.
- No promises.
- No pressure.
- Goal is to book a conversation.
- If lead language is Spanish, write Spanish.
- If English, write English.
`,
        },
        { role: "user", content: JSON.stringify(lead) },
      ],
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    const { error } = await supabase
      .from("crm_leads")
      .update({
        sms_draft: result.sms || "",
        email_draft: result.email || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "ai_drafts",
      note: "AI SMS and email drafts generated.",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not generate drafts." }, { status: 500 });
  }
}