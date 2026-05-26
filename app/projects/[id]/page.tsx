import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: project } = await supabase
    .from("app_projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-5xl font-black">Project Not Found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white p-8">
      <div className="mx-auto max-w-7xl">

        <nav className="mb-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold"
          >
            Home
          </Link>

          <Link
            href="/projects"
            className="rounded-xl bg-purple-600 px-5 py-3 font-bold"
          >
            Projects
          </Link>

          <Link
            href="/agents"
            className="rounded-xl bg-green-600 px-5 py-3 font-bold"
          >
            Agents
          </Link>

          <Link
            href="/actions"
            className="rounded-xl bg-pink-600 px-5 py-3 font-bold"
          >
            Actions
          </Link>
        </nav>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                Phase 4 Workspace
              </p>

              <h1 className="mt-3 text-5xl font-black">
                {project.title}
              </h1>
            </div>

            <div className="rounded-full bg-green-600 px-6 py-3 text-sm font-bold">
              BUILD READY
            </div>
          </div>

          <p className="text-zinc-400 text-lg">
            {project.prompt}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <button className="rounded-xl bg-blue-600 px-6 py-4 font-bold">
              Build Pack
            </button>

            <button className="rounded-xl bg-purple-600 px-6 py-4 font-bold">
              Files
            </button>

            <button className="rounded-xl bg-pink-600 px-6 py-4 font-bold">
              Export
            </button>

            <button className="rounded-xl bg-orange-600 px-6 py-4 font-bold">
              Launch
            </button>

            <button className="rounded-xl bg-cyan-600 px-6 py-4 font-bold">
              Readiness
            </button>

            <button className="rounded-xl bg-green-600 px-6 py-4 font-bold">
              Real Build
            </button>

            <button className="rounded-xl bg-red-600 px-6 py-4 font-bold">
              Go Live
            </button>

          </div>

          <div className="mt-10 rounded-2xl border border-zinc-800 bg-black p-8">
            <h2 className="text-3xl font-black">
              launch_ready
            </h2>

            <p className="mt-4 text-zinc-400">
              Your AI app factory project workspace is now connected correctly.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}