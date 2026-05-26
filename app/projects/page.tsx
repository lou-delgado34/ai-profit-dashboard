import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ProjectsPage() {
  const { data: projects } = await supabase
    .from("app_projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">Home</Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Projects</Link>
          <Link href="/agents" className="rounded-xl bg-green-600 px-5 py-3 font-bold">Agents</Link>
          <Link href="/actions" className="rounded-xl bg-pink-600 px-5 py-3 font-bold">Actions</Link>
        </nav>

        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI Software Factory
            </p>
            <h1 className="mt-3 text-5xl font-black">Projects Dashboard</h1>
            <p className="mt-4 text-lg text-zinc-400">
              Continue building your saved app projects.
            </p>
          </div>

          <Link href="/" className="rounded-2xl bg-blue-600 px-7 py-4 font-black">
            + New Project
          </Link>
        </div>

        <div className="space-y-5">
          {(projects || []).map((project: any) => (
            <div
              key={project.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-3xl font-black">
                    {project.title || "Untitled Project"}
                  </h2>

                  <p className="mt-3 text-zinc-400">{project.prompt}</p>

                  <p className="mt-3 text-sm font-bold uppercase text-blue-400">
                    {project.app_type || "Custom SaaS App"}
                  </p>
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-center font-bold hover:bg-blue-700"
                >
                  Continue Building
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}