import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      messages: [
        {
          role: "system",
          content: `
You are an AI sales assistant for a compliant TERM LIFE insurance CRM.

Give one clear next best action for this lead.

Rules:
- TERM LIFE only.
- No whole life.
- No variable life.
- No investment advice.
- No guarantees.
- Keep it simple.
- Keep it compliant.
- Write like a helpful coach.
- Return JSON only.

Format:
{
  "title": "short title",
  "recommendation": "what the advisor should do next",
  "priority": "high | normal | low"
}
`,
        },
        {
          role: "user",
          content: JSON.stringify(lead),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        title: "Follow up with lead",
        recommendation:
          "Send a friendly follow-up and invite the lead to a short conversation about protecting their family with term life insurance.",
        priority: "normal",
      };
    }

    const { data, error } = await supabase
      .from("crm_ai_recommendations")
      .insert({
        lead_id: leadId,
        recommendation_type: "next_best_action",
        title: parsed.title || "Next Best Action",
        recommendation:
          parsed.recommendation ||
          "Follow up with the lead and invite them to book a short appointment.",
        priority: parsed.priority || "normal",
        status: "open",
      })
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "ai_next_best_action",
      note: data.recommendation,
    });

    return NextResponse.json({
      success: true,
      recommendation: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not generate next best action." },
      { status: 500 }
    );
  }
}