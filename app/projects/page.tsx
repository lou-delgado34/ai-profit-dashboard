"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ProjectsListClient({
  projects,
}: {
  projects: any[];
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [appType, setAppType] = useState("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title?.toLowerCase().includes(search.toLowerCase()) ||
        project.prompt?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        appType === "all" || project.app_type === appType;

      return matchesSearch && matchesType;
    });
  }, [projects, search, appType]);

  const totalProjects = projects.length;
  const buildPacksReady = projects.filter(
    (p) => p.build_pack_status === "ready"
  ).length;

  const buildReady = projects.filter(
    (p) => p.real_build_status === "ready_for_next_phase" ||
           p.status === "Build Ready"
  ).length;

  const appTypes = [
    "all",
    ...Array.from(
      new Set(projects.map((p) => p.app_type).filter(Boolean))
    ),
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
          AI SOFTWARE FACTORY
        </p>

        <h1 className="mt-3 text-6xl font-black">Projects Dashboard</h1>

        <p className="mt-4 text-2xl text-zinc-400">
          Search, filter, continue building, and track project progress.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-zinc-400">TOTAL PROJECTS</p>
          <h2 className="mt-4 text-6xl font-black">{totalProjects}</h2>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-zinc-400">BUILD PACKS READY</p>
          <h2 className="mt-4 text-6xl font-black">{buildPacksReady}</h2>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-zinc-400">BUILD READY</p>
          <h2 className="mt-4 text-6xl font-black">{buildReady}</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="rounded-3xl border border-zinc-800 bg-black p-6 text-xl outline-none"
        />

        <select
          value={appType}
          onChange={(e) => setAppType(e.target.value)}
          className="rounded-3xl border border-zinc-800 bg-black p-6 text-xl outline-none"
        >
          <option value="all">All App Types</option>

          {appTypes
            .filter((type) => type !== "all")
            .map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-8">
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-400">
            No projects found.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-5xl font-black">
                    {project.title}
                  </h2>

                  <p className="mt-4 text-2xl text-zinc-400">
                    {project.prompt}
                  </p>

                  <p className="mt-5 text-xl font-bold uppercase text-blue-400">
                    {project.app_type || "Custom SaaS App"}
                  </p>

                  <p className="mt-4 text-lg text-zinc-500">
                    {new Date(project.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-full bg-green-600 px-8 py-3 text-center font-bold">
                    {project.status || "Build Ready"}
                  </div>

                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="rounded-2xl bg-blue-600 px-8 py-5 text-xl font-bold hover:bg-blue-700"
                  >
                    Continue Building
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}