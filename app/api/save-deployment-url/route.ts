import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { projectId, deploymentUrl } = await req.json();

    if (!projectId || !deploymentUrl) {
      return NextResponse.json(
        { error: "Missing projectId or deploymentUrl." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("app_projects")
      .update({
        deployment_url: deploymentUrl,
        deployment_status: "live_url_saved",
        deploy_notes: ["Live deployment URL saved."],
      })
      .eq("id", projectId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      deploymentUrl,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not save deployment URL." },
      { status: 500 }
    );
  }
}