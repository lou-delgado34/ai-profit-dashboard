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
    const { projectId, prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a Base44-style AI app builder.

Return ONLY valid JSON.

Create a full app build pack with this structure:

{
  "appName": "",
  "summary": "",
  "pages": [
    {
      "name": "",
      "route": "",
      "purpose": "",
      "features": [],
      "uiNotes": ""
    }
  ],
  "database": [
    {
      "table": "",
      "purpose": "",
      "columns": []
    }
  ],
  "apiRoutes": [
    {
      "route": "",
      "method": "",
      "purpose": "",
      "input": "",
      "output": ""
    }
  ],
  "components": [
    {
      "name": "",
      "purpose": "",
      "props": []
    }
  ],
  "envVars": [],
  "userFlow": [],
  "launchSteps": [],
  "copyPastePrompt": ""
}

Rules:
- Keep it practical.
- Make it buildable in Next.js, Supabase, Vercel.
- Include pages, tables, APIs, components, and launch steps.
- Do not include markdown.
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const buildPack = JSON.parse(raw);

    const { error } = await supabase
      .from("app_projects")
      .update({
        build_pack: buildPack,
        result: JSON.stringify(buildPack, null, 2),
      })
      .eq("id", projectId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      buildPack,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not generate build pack." },
      { status: 500 }
    );
  }
}