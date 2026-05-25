import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId." }, { status: 400 });
    }

    const { error } = await supabase
      .from("app_projects")
      .update({
        build_pack: {},
        generated_files: {},
        result: "",
        admin_notes: ["Build data reset by admin."],
      })
      .eq("id", projectId);

    if (error) throw error;

    await supabase
      .from("app_build_jobs")
      .delete()
      .eq("project_id", projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Could not reset project build." },
      { status: 500 }
    );
  }
}