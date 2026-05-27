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
      messages: [
        {
          role: "system",
          content: `
Create a short follow-up message for a term life insurance lead.

Rules:
- Friendly, natural, not pushy.
- Educational only.
- No promises of approval, savings, income, or guaranteed results.
- Goal: book a simple conversation.
- If language is Spanish, write in Spanish.
- If language is English, write in English.
Return only the message.
`,
        },
        {
          role: "user",
          content: JSON.stringify(lead),
        },
      ],
    });

    const message =
      completion.choices[0]?.message?.content || "No follow-up created.";

    const { data: updatedLead, error } = await supabase
      .from("crm_leads")
      .update({
        follow_up_message: message,
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
      { error: "Could not generate follow-up." },
      { status: 500 }
    );
  }
}