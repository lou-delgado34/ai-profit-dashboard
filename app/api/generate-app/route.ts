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
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an elite AI app builder.

Create a complete app blueprint in this EXACT format:

===== APP OVERVIEW =====
Explain the app simply.

===== USER ROLES =====
List roles.

===== MODULES =====
List modules.

===== PAGES AND ROUTES =====
List pages with paths.

===== SUPABASE SQL =====
Give real PostgreSQL SQL code.

===== NEXTJS FILE STRUCTURE =====
Show file paths.

===== PAGE CODE =====
Give copy-paste TSX page code.

===== COMPONENT CODE =====
Give copy-paste TSX component code.

===== API ROUTE CODE =====
Give copy-paste route.ts code.

===== ENV VARIABLES =====
List env variables.

===== BUILD STEPS =====
Give simple step-by-step instructions.

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

    const { data, error } = await supabase
      .from("app_projects")
      .insert({
        title: prompt.slice(0, 60),
        prompt,
        result,
        status: "generated",
        project_status: "draft",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      result,
      projectId: data.id,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "AI generation failed." },
      { status: 500 }
    );
  }
}