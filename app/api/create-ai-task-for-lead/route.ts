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
Create one CRM task for this TERM LIFE insurance lead.

Rules:
- TERM LIFE only.
- No pressure.
- No guarantees.
- No investment advice.
- Return JSON only.

Format:
{
  "title": "task title",
  "description": "task description",
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
        description:
          "Send a friendly follow-up and ask if they want to schedule a short appointment.",
        priority: "normal",
      };
    }

    const due = new Date();
    due.setHours(due.getHours() + 24);

    const { data: task, error } = await supabase
      .from("crm_tasks")
      .insert({
        lead_id: leadId,
        task_type: "ai_generated",
        title: parsed.title || "AI Follow-Up Task",
        description:
          parsed.description ||
          "Follow up with the lead and invite them to book an appointment.",
        due_at: due.toISOString(),
        priority: parsed.priority || "normal",
        status: "pending",
      })
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("crm_lead_activities").insert({
      lead_id: leadId,
      activity_type: "ai_task_created",
      note: `AI task created: ${task.title}`,
    });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not create AI task." },
      { status: 500 }
    );
  }
}