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
You are a TERM LIFE insurance sales coach.

Coach the advisor on how to talk to this lead.

Rules:
- TERM LIFE only.
- No whole life.
- No variable life.
- No securities advice.
- No guarantees.
- No pressure.
- Simple sixth-grade language.
- Give short bullets.
`,
        },
        {
          role: "user",
          content: JSON.stringify(lead),
        },
      ],
    });

    const coach =
      completion.choices[0]?.message?.content ||
      "Ask simple questions, listen first, and invite the lead to a short appointment.";

    const { data, error } = await supabase
      .from("crm_ai_recommendations")
      .insert({
        lead_id: leadId,
        recommendation_type: "sales_coach",
        title: "AI Sales Coach",
        recommendation: coach,
        priority: "normal",
        status: "open",
      })
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "ai_sales_coach",
      note: "AI sales coaching generated.",
    });

    return NextResponse.json({
      success: true,
      coach: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not generate AI sales coach." },
      { status: 500 }
    );
  }
}