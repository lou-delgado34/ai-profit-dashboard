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
    const { id, prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an elite AI app builder.

Regenerate the project in this EXACT format:

===== APP OVERVIEW =====
===== USER ROLES =====
===== MODULES =====
===== PAGES AND ROUTES =====
===== SUPABASE SQL =====
===== NEXTJS FILE STRUCTURE =====
===== PAGE CODE =====
===== COMPONENT CODE =====
===== API ROUTE CODE =====
===== ENV VARIABLES =====
===== BUILD STEPS =====

Rules:
- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Use Supabase.
- Keep it copy-paste friendly.
- Do not mention you are an AI.
`,
        },
        { role: "user", content: prompt },
      ],
    });

    const result = completion.choices[0]?.message?.content || "No result.";

    await supabase
      .from("app_projects")
      .update({
        result,
        project_status: "building",
      })
      .eq("id", id);

    return NextResponse.json({ result });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Regeneration failed." },
      { status: 500 }
    );
  }
}