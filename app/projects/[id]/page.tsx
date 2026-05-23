import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import GenerateBuildPackButton from "./generate-build-pack-button";
import GenerateProjectFilesButton from "./generate-project-files-button";
import BuildPackViewer from "./build-pack-viewer";
import GeneratedFilesViewer from "./generated-files-viewer";

export const dynamic = "force-dynamic";

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

  const { data: project } = await supabase
    .from("app_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <h1 className="text-4xl font-black">Project not found</h1>
        <Link href="/projects" className="mt-6 inline-block rounded-xl bg-purple-600 px-5 py-3 font-bold">
          Back to Projects
        </Link>
      </main>
    );
  }

  const buildPack = project.build_pack || {};
  const generatedFiles = project.generated_files || {};

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-zinc-800 px-5 py-3 font-bold hover:bg-zinc-700">Home</Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Projects</Link>
          <Link href="/agents" className="rounded-xl bg-zinc-800 px-5 py-3 font-bold hover:bg-zinc-700">Agents</Link>
          <Link href="/actions" className="rounded-xl bg-zinc-800 px-5 py-3 font-bold hover:bg-zinc-700">Actions</Link>
        </nav>

        <section className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
            Project Workspace
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {project.title || "Untitled Project"}
          </h1>

          <p className="mt-4 text-zinc-400">
            {project.prompt}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <GenerateBuildPackButton
              projectId={project.id}
              prompt={project.prompt}
            />

            <GenerateProjectFilesButton
              projectId={project.id}
              prompt={project.prompt}
              buildPack={buildPack}
            />
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Build Pack</p>
            <p className="mt-2 text-3xl font-black">
              {Object.keys(buildPack).length > 0 ? "Ready" : "Missing"}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Code Files</p>
            <p className="mt-2 text-3xl font-black">
              {Object.keys(generatedFiles).length > 0 ? "Ready" : "Missing"}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Mode</p>
            <p className="mt-2 text-3xl font-black">Option A</p>
          </div>
        </section>

        <div className="space-y-8">
          <GeneratedFilesViewer generatedFiles={generatedFiles} />
          <BuildPackViewer buildPack={buildPack} />
        </div>
      </div>
    </main>
  );
}