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
  "score": 0,
  "summary": "",
  "stage": ""
}

Score the lead from 1-100.

Rules:
- Term life insurance only.
- Keep it compliant and educational.
- Do not promise approval, savings, income, or guaranteed results.
- Stage must be one of: new, warm, appointment_ready, needs_follow_up, not_ready.
`,
        },
        {
          role: "user",
          content: JSON.stringify(lead),
        },
      ],
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    const { data: updatedLead, error } = await supabase
      .from("crm_leads")
      .update({
        ai_score: result.score || 0,
        ai_summary: result.summary || "",
        stage: result.stage || "needs_follow_up",
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not score lead." },
      { status: 500 }
    );
  }
}