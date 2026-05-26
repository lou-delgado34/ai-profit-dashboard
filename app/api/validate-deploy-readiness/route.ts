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

    const { data: project, error } = await supabase
      .from("app_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const buildPack = project.build_pack || {};
    const files = project.generated_files || {};

    const checklist = [
      {
        label: "Build Pack generated",
        passed: Object.keys(buildPack).length > 0,
      },
      {
        label: "Code files generated",
        passed: Object.keys(files).length > 0,
      },
      {
        label: "Pages generated",
        passed: files.pages?.length > 0,
      },
      {
        label: "Components generated",
        passed: files.components?.length > 0,
      },
      {
        label: "API routes generated",
        passed: files.apiRoutes?.length > 0,
      },
      {
        label: "Supabase SQL generated",
        passed: files.sql?.length > 0,
      },
      {
        label: "Environment variables listed",
        passed: files.env?.length > 0,
      },
      {
        label: "Launch checklist generated",
        passed: files.launchChecklist?.length > 0,
      },
    ];

    const allPassed = checklist.every((item) => item.passed);

    const { error: updateError } = await supabase
      .from("app_projects")
      .update({
        deployment_checklist: checklist,
        deployment_status: allPassed ? "ready_for_deploy" : "missing_items",
        sql_status: files.sql?.length > 0 ? "sql_ready" : "sql_missing",
        deploy_notes: [
          allPassed
            ? "Project is ready for deployment prep."
            : "Project is missing required deploy items.",
        ],
      })
      .eq("id", projectId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      deploymentStatus: allPassed ? "ready_for_deploy" : "missing_items",
      checklist,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not validate deploy readiness." },
      { status: 500 }
    );
  }
}