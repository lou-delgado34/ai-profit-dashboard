import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AutomationConsole from "./automation-console";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project } = await supabase
    .from("app_projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { data: jobs } = await supabase
    .from("ai_automation_jobs")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (!project) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-5xl font-black">Project Not Found</h1>

        <Link
          href="/projects"
          className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-4 font-bold"
        >
          Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
            Home
          </Link>

          <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
            Projects
          </Link>

          <Link href="/agents" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            Agents
          </Link>

          <Link href="/actions" className="rounded-xl bg-pink-600 px-5 py-3 font-bold">
            Actions
          </Link>
        </nav>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
            Phase 5 AI Automation Workspace
          </p>

          <h1 className="mt-3 text-5xl font-black">
            {project.title || "Untitled Project"}
          </h1>

          <p className="mt-5 text-lg text-zinc-400">
            {project.prompt}
          </p>

          <div className="mt-8 rounded-2xl border border-green-800 bg-green-950/30 p-6">
            <h2 className="text-3xl font-black text-green-300">
              launch_ready
            </h2>

            <p className="mt-3 text-zinc-400">
              Project workspace is connected correctly.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <AutomationConsole projectId={project.id} jobs={jobs || []} />
        </div>
      </div>
    </main>
  );
}