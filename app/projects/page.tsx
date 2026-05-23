import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ProjectsPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap gap-4">
          <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 font-bold">Home</Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-6 py-3 font-bold">Projects</Link>
          <Link href="/agents" className="rounded-xl bg-green-600 px-6 py-3 font-bold">Agents</Link>
          <Link href="/actions" className="rounded-xl bg-pink-600 px-6 py-3 font-bold">Actions</Link>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-bold uppercase tracking-[0.35em] text-blue-400">
              AI SOFTWARE FACTORY
            </p>
            <h1 className="mt-3 text-6xl font-black">Projects</h1>
            <p className="mt-3 text-xl text-zinc-400">
              Open one project at a time and continue building it.
            </p>
          </div>

          <Link href="/" className="rounded-2xl bg-blue-600 px-7 py-4 font-black">
            + New Project
          </Link>
        </div>

        <div className="space-y-6">
          {(projects || []).map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block rounded-3xl border border-zinc-800 bg-zinc-950 p-7 hover:border-blue-500"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">
                    {project.title || project.name || "Untitled Project"}
                  </h2>

                  <p className="mt-3 text-sm text-zinc-500">
                    {project.created_at ? new Date(project.created_at).toLocaleString() : ""}
                  </p>

                  <p className="mt-5 max-w-4xl text-lg text-zinc-300">
                    {project.prompt || project.description || "No project description yet."}
                  </p>
                </div>

                <span className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase">
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