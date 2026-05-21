import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import RenameProjectForm from "./rename-project-form";
import ProjectStatusSelect from "./project-status-select";
import ProjectWorkspaceTabs from "./project-workspace-tabs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("app_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-black">Project not found</h1>

          <Link
            href="/projects"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold"
          >
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-xl bg-zinc-800 px-5 py-3 font-bold hover:bg-zinc-700"
          >
            ← Projects
          </Link>

          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
          >
            + Create New App
          </Link>
        </div>

        <section className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                AI Project Workspace
              </p>

              <h1 className="mt-2 max-w-4xl text-4xl font-black">
                {project.title}
              </h1>

              <p className="mt-3 text-sm text-zinc-500">
                Created: {new Date(project.created_at).toLocaleString()}
              </p>
            </div>

            <span className="rounded-full border border-zinc-700 bg-black px-4 py-2 text-sm font-bold uppercase text-zinc-300">
              {project.project_status || "draft"}
            </span>
          </div>
        </section>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="mb-4 text-2xl font-black">Project Settings</h2>

            <ProjectStatusSelect
              id={project.id}
              currentStatus={project.project_status}
            />
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="mb-4 text-2xl font-black">Project Name</h2>

            <RenameProjectForm
              id={project.id}
              currentTitle={project.title}
            />
          </section>
        </div>

        <ProjectWorkspaceTabs project={project} />
      </div>
    </main>
  );
}