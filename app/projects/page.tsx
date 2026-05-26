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
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-6xl font-black">Projects</h1>

        <p className="mt-3 text-zinc-400">
          Open one project at a time and continue building it.
        </p>

        <div className="mt-10 space-y-6">
          {(projects || []).map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-blue-500"
            >
              <h2 className="text-4xl font-black">
                {project.title || "Untitled Project"}
              </h2>

              <p className="mt-3 text-zinc-400">
                {project.prompt}
              </p>

              <p className="mt-4 text-sm font-bold uppercase text-blue-400">
                Click anywhere on this card to continue building
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}