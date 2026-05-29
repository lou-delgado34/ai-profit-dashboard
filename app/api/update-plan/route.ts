import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_CREDITS: Record<string, number> = {
  free: 10,
  pro: 100,
  elite: 500,
  admin: 999999,
};

export async function POST(req: Request) {
  try {
    const { email, plan } = await req.json();

    if (!email || !plan) {
      return NextResponse.json(
        { error: "Missing email or plan." },
        { status: 400 }
      );
    }

    const credits = PLAN_CREDITS[plan] || 10;

    const { data, error } = await supabase
      .from("user_subscriptions")
      .upsert(
        {
          email,
          plan,
          credits,
          is_admin: plan === "admin",
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, subscription: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not update plan." },
      { status: 500 }
    );
  }
}