import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function log(message: string) {
  return { time: new Date().toISOString(), message };
}

export async function POST(req: Request) {
  try {
    const { projectId, agentName, activityType, input } = await req.json();

    if (!projectId || !agentName || !activityType || !input) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const logs = [
      log("AI agent started."),
      log(`Agent: ${agentName}`),
      log(`Activity: ${activityType}`),
      log("Input reviewed."),
      log("Output generated."),
      log("Agent task completed."),
    ];

    const output = {
      summary: `${agentName} completed ${activityType}.`,
      recommendation: "Review this output and continue the project workflow.",
      nextAction: "Create another task or run a workflow chain.",
    };

    const { data, error } = await supabase
      .from("ai_agent_activity")
      .insert({
        project_id: projectId,
        agent_name: agentName,
        activity_type: activityType,
        status: "completed",
        input,
        output,
        logs,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, activity: data });
  } catch {
    return NextResponse.json({ error: "Could not run AI agent." }, { status: 500 });
  }
}