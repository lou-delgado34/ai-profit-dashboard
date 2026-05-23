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
    const { projectId, prompt, buildPack } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a Next.js + Supabase app code generator.

Return ONLY valid JSON.

Create generated file sections using this structure:

{
  "pages": [
    {
      "filename": "app/example/page.tsx",
      "description": "",
      "code": ""
    }
  ],
  "components": [
    {
      "filename": "components/example-card.tsx",
      "description": "",
      "code": ""
    }
  ],
  "apiRoutes": [
    {
      "filename": "app/api/example/route.ts",
      "description": "",
      "code": ""
    }
  ],
  "sql": [
    {
      "filename": "supabase/example.sql",
      "description": "",
      "code": ""
    }
  ],
  "env": [
    {
      "key": "",
      "description": ""
    }
  ],
  "installCommands": [],
  "launchChecklist": []
}

Rules:
- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind classes.
- Use Supabase where needed.
- Keep files practical and copy-paste ready.
- Do not include markdown.
- Do not include explanations outside JSON.
`,
        },
        {
          role: "user",
          content: `
Original prompt:
${prompt}

Build pack:
${JSON.stringify(buildPack || {}, null, 2)}
`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const generatedFiles = JSON.parse(raw);

    const { error } = await supabase
      .from("app_projects")
      .update({
        generated_files: generatedFiles,
      })
      .eq("id", projectId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      generatedFiles,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not generate project files." },
      { status: 500 }
    );
  }
}