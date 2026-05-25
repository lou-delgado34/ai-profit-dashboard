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
    const { projectId, prompt, buildPack } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a production Next.js + Supabase code generator.

Return ONLY valid JSON.

Generate a stronger file package using this exact JSON:

{
  "appType": "",
  "pages": [
    {
      "filename": "app/dashboard/page.tsx",
      "description": "",
      "code": ""
    }
  ],
  "components": [
    {
      "filename": "components/example.tsx",
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
      "filename": "supabase/schema.sql",
      "description": "",
      "code": ""
    }
  ],
  "adminFiles": [
    {
      "filename": "app/admin/page.tsx",
      "description": "",
      "code": ""
    }
  ],
  "agents": [
    {
      "name": "",
      "role": "",
      "instructions": "",
      "tools": []
    }
  ],
  "actions": [
    {
      "name": "",
      "type": "",
      "contentTemplate": "",
      "approvalRequired": true
    }
  ],
  "env": [
    {
      "key": "",
      "description": ""
    }
  ],
  "installCommands": [],
  "launchChecklist": [],
  "securityChecklist": [],
  "testingChecklist": [],
  "adminChecklist": []
}

Rules:
- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind.
- Use Supabase environment variables.
- Include admin page/file when useful.
- Include SQL with tables and basic RLS notes.
- Do not hardcode secrets.
- Keep code copy-paste ready.
- Include error handling in API routes.
- If app involves finance/insurance, avoid income guarantees and include approval/compliance reminders.
`,
        },
        {
          role: "user",
          content: `
Prompt:
${prompt}

Build Pack:
${JSON.stringify(buildPack || {}, null, 2)}
`,
        },
      ],
    });

    const generatedFiles = JSON.parse(
      completion.choices[0]?.message?.content || "{}"
    );

    const { error } = await supabase
      .from("app_projects")
      .update({ generated_files: generatedFiles })
      .eq("id", projectId);

    if (error) throw error;

    return NextResponse.json({ success: true, generatedFiles });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not generate advanced project files." },
      { status: 500 }
    );
  }
}