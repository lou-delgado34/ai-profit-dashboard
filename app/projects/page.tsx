import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

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
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
              AI Software Factory
            </p>

            <h1 className="mt-2 text-5xl font-black">
              Projects
            </h1>

            <p className="mt-3 text-zinc-400">
              Open one project at a time and continue building it.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-6 py-3 text-center font-bold hover:bg-blue-700"
          >
            + New Project
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500 bg-red-950 p-4">
            Could not load projects.
          </div>
        )}

        {!projects || projects.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-black">No projects yet</h2>
            <p className="mt-2 text-zinc-400">
              Click New Project to create your first app.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-blue-500 hover:bg-zinc-900"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">
                      {project.title}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      {new Date(project.created_at).toLocaleString()}
                    </p>

                    <p className="mt-4 line-clamp-2 text-zinc-300">
                      {project.prompt}
                    </p>
                  </div>

                  <span className="rounded-full border border-zinc-700 bg-black px-4 py-2 text-sm font-bold uppercase text-zinc-300">
                    {project.project_status || "draft"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}