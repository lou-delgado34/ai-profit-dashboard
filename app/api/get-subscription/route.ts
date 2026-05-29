import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_EMAIL = "lou.delgado.pfs@gmail.com";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email." }, { status: 400 });
    }

    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const { data: existing } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (isAdmin && !existing.is_admin) {
        const { data: updated } = await supabase
          .from("user_subscriptions")
          .update({
            is_admin: true,
            plan: "admin",
            credits: 999999,
            updated_at: new Date().toISOString(),
          })
          .eq("email", email)
          .select("*")
          .single();

        return NextResponse.json({ success: true, subscription: updated });
      }

      return NextResponse.json({ success: true, subscription: existing });
    }

    const { data, error } = await supabase
      .from("user_subscriptions")
      .insert({
        email,
        plan: isAdmin ? "admin" : "free",
        credits: isAdmin ? 999999 : 10,
        is_admin: isAdmin,
        status: "active",
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, subscription: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not load subscription." },
      { status: 500 }
    );
  }
}