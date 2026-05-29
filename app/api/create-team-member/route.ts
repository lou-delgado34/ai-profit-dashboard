import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, email, role, licenseLevel } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Missing name." },
        { status: 400 }
      );
    }

    const { data: member, error } = await supabase
      .from("team_members")
      .insert({
        name,
        email: email || null,
        role: role || "advisor",
        license_level: licenseLevel || "life_only",
        status: "active",
        points: 0,
      })
      .select("*")
      .single();

    if (error) throw error;

    await supabase.from("team_activity").insert({
      member_id: member.id,
      activity_type: "member_created",
      description: `${name} was added to the team.`,
      points: 10,
    });

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not create team member." },
      { status: 500 }
    );
  }
}