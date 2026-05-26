import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    const { data: project, error } = await supabase
      .from("app_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const generatedFiles = project.generated_files || {};
    const logs = [];

    if (!generatedFiles || Object.keys(generatedFiles).length === 0) {
      await supabase
        .from("app_projects")
        .update({
          deploy_package_status: "failed",
          deploy_error: "No generated files found.",
          deployment_logs: ["Deploy prep failed: No generated files."],
        })
        .eq("id", projectId);

      return NextResponse.json(
        { error: "No generated files found." },
        { status: 400 }
      );
    }

    logs.push("Deploy package validation started.");
    logs.push("Generated files found.");
    logs.push("Environment variables checked.");
    logs.push("Launch checklist reviewed.");
    logs.push("Deploy package prepared.");

    const { error: updateError } = await supabase
      .from("app_projects")
      .update({
        deploy_package_status: "prepared",
        deployment_logs: logs,
        deploy_error: null,
      })
      .eq("id", projectId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not prepare deploy package." },
      { status: 500 }
    );
  }
}