import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("app_projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black p-8 text-white">
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

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI Software Factory
            </p>

            <h1 className="mt-3 text-6xl font-black">
              Projects
            </h1>

            <p className="mt-4 text-xl text-zinc-400">
              Open one project at a time and continue building it.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl bg-blue-600 px-7 py-4 font-black hover:bg-blue-700"
          >
            + New Project
          </Link>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-800 bg-red-950/40 p-6 text-red-200">
            Could not load projects.
          </div>
        )}

        {!error && (!projects || projects.length === 0) && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-3xl font-black">No projects yet</h2>
            <p className="mt-3 text-zinc-400">
              Click + New Project and create your first app.
            </p>
          </div>
        )}

        <div className="space-y-5">
          {(projects || []).map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-blue-500"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-3xl font-black">
                    {project.title || "Untitled Project"}
                  </h2>

                  <p className="mt-3 text-zinc-400">
                    {project.prompt}
                  </p>

                  <p className="mt-3 text-sm text-zinc-600">
                    {project.created_at
                      ? new Date(project.created_at).toLocaleString()
                      : ""}
                  </p>
                </div>

                <span className="rounded-full border border-zinc-700 bg-black px-5 py-2 text-sm font-bold uppercase">
                  {project.status || "draft"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}