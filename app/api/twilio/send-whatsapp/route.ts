import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();

    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: `whatsapp:${to}`,
      body: message,
    });

    return NextResponse.json({ success: true, sid: result.sid });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "WhatsApp send failed." },
      { status: 500 }
    );
  }
}