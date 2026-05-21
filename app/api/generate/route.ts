import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert in financial services, recruiting, and term life insurance. Keep responses simple, practical, and designed to generate leads and close sales. Always include English and Spanish.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return NextResponse.json({
    result: response.choices[0].message.content,
  });
}