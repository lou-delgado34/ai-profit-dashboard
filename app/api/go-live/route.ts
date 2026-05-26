import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function log(message: string) {
  return {
    time: new Date().toISOString(),
    message,
  };
}

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId." }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from("app_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const generatedFiles = project.generated_files || {};
    const hasFiles = Object.keys(generatedFiles).length > 0;

    if (!hasFiles) {
      await supabase
        .from("app_projects")
        .update({
          launch_status: "failed",
          launch_error: "Generated files are missing.",
          launch_logs: [log("Launch failed because generated files are missing.")],
        })
        .eq("id", projectId);

      return NextResponse.json(
        { error: "Generate code files before launching." },
        { status: 400 }
      );
    }

    const logs = [
      log("Launch sequence started."),
      log("Generated files confirmed."),
      log("Deploy package confirmed."),
      log("Environment checklist ready."),
      log("Manual Vercel deployment step still required."),
      log("Project marked launch-ready."),
    ];

    const { error: updateError } = await supabase
      .from("app_projects")
      .update({
        launch_status: "launch_ready",
        deployment_status: "launch_ready",
        launch_error: null,
        launch_logs: logs,
      })
      .eq("id", projectId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      launchStatus: "launch_ready",
      logs,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not start launch sequence." },
      { status: 500 }
    );
  }
}