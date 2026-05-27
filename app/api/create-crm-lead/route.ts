import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, email, language, source, interest, notes } = body;

    const { data, error } = await supabase
      .from("crm_leads")
      .insert({
        name,
        phone,
        email,
        language: language || "English",
        source: source || "manual",
        interest,
        notes,
        stage: "new",
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not create lead." },
      { status: 500 }
    );
  }
}