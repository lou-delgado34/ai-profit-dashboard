import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function detectAppType(prompt: string) {
  const text = prompt.toLowerCase();

  if (text.includes("crm") || text.includes("leads")) return "CRM";
  if (text.includes("course") || text.includes("training")) return "Training Platform";
  if (text.includes("content") || text.includes("social")) return "Content System";
  if (text.includes("finance") || text.includes("financial")) return "Financial App";
  if (text.includes("appointment") || text.includes("booking")) return "Booking App";
  if (text.includes("agent") || text.includes("automation")) return "AI Agent System";

  return "Custom SaaS App";
}

export async function POST(req: Request) {
  try {
    const { projectId, prompt } = await req.json();

    const appType = detectAppType(prompt || "");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a senior AI SaaS architect.

Return ONLY valid JSON.

The detected app type is: ${appType}

Create a serious production-style app build pack.

Use this exact JSON:

{
  "appName": "",
  "appType": "${appType}",
  "summary": "",
  "targetUsers": [],
  "mainProblemSolved": "",
  "coreFeatures": [],
  "recommendedTechStack": {
    "frontend": "Next.js App Router",
    "backend": "Next.js API Routes",
    "database": "Supabase",
    "auth": "Supabase Auth",
    "hosting": "Vercel",
    "styling": "Tailwind CSS"
  },
  "pages": [
    {
      "name": "",
      "route": "",
      "purpose": "",
      "features": [],
      "uiSections": [],
      "dataNeeded": []
    }
  ],
  "database": [
    {
      "table": "",
      "purpose": "",
      "columns": [],
      "relationships": [],
      "rlsNotes": ""
    }
  ],
  "apiRoutes": [
    {
      "route": "",
      "method": "",
      "purpose": "",
      "input": "",
      "output": "",
      "securityNotes": ""
    }
  ],
  "components": [
    {
      "name": "",
      "purpose": "",
      "props": [],
      "usedOnPages": []
    }
  ],
  "agents": [
    {
      "name": "",
      "role": "",
      "instructions": "",
      "tools": [],
      "triggerIdeas": []
    }
  ],
  "actions": [
    {
      "name": "",
      "type": "",
      "purpose": "",
      "approvalRequired": true
    }
  ],
  "adminControls": [],
  "envVars": [],
  "userFlow": [],
  "adminFlow": [],
  "launchSteps": [],
  "securityChecklist": [],
  "testingChecklist": [],
  "complianceNotes": []
}

Rules:
- Make it practical and buildable.
- Do not make fake promises.
- If insurance, finance, investments, recruiting, or messaging is involved, add compliance notes.
- For insurance, focus on term life only unless the user asks otherwise.
- For investment or securities topics, include suitability, licensing, and approval reminders.
- Include admin controls.
- Include database security notes.
`,
        },
        { role: "user", content: prompt },
      ],
    });

    const buildPack = JSON.parse(completion.choices[0]?.message?.content || "{}");

    const { error } = await supabase
      .from("app_projects")
      .update({
        build_pack: buildPack,
        result: JSON.stringify(buildPack, null, 2),
        app_type: appType,
      })
      .eq("id", projectId);

    if (error) throw error;

    return NextResponse.json({ success: true, buildPack });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not generate advanced build pack." },
      { status: 500 }
    );
  }
}