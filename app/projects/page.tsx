"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProjectCardActions from "./project-card-actions";

type Project = {
  id: string;
  title: string;
  prompt: string;
  status?: string;
  app_type?: string;
  build_pack?: any;
  generated_files?: any;
  created_at?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadProjects = async () => {
    setLoading(true);

    const res = await fetch("/api/get-projects");
    const data = await res.json();

    if (res.ok) {
      setProjects(data.projects || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (search.trim()) {
      const text = search.toLowerCase();

      list = list.filter(
        (project) =>
          project.title?.toLowerCase().includes(text) ||
          project.prompt?.toLowerCase().includes(text) ||
          project.app_type?.toLowerCase().includes(text)
      );
    }

    if (filter !== "all") {
      list = list.filter(
        (project) =>
          (project.app_type || "Custom SaaS App").toLowerCase() ===
          filter.toLowerCase()
      );
    }

    return list;
  }, [projects, search, filter]);

  const getStatus = (project: Project) => {
    const hasBuildPack = Object.keys(project.build_pack || {}).length > 0;
    const hasFiles = Object.keys(project.generated_files || {}).length > 0;

    if (hasBuildPack && hasFiles) return "Build Ready";
    if (hasBuildPack) return "Build Pack Ready";
    return "Draft";
  };

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

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI Software Factory
            </p>

            <h1 className="mt-3 text-5xl font-black">Projects Dashboard</h1>

            <p className="mt-4 text-lg text-zinc-400">
              Search, duplicate, rename, delete, and continue building.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl bg-blue-600 px-7 py-4 font-black hover:bg-blue-700"
          >
            + New Project
          </Link>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white outline-none"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white outline-none"
          >
            <option value="all">All App Types</option>
            <option value="CRM">CRM</option>
            <option value="Training Platform">Training Platform</option>
            <option value="Content System">Content System</option>
            <option value="Financial App">Financial App</option>
            <option value="Booking App">Booking App</option>
            <option value="AI Agent System">AI Agent System</option>
            <option value="Custom SaaS App">Custom SaaS App</option>
          </select>
        </section>

        {loading && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            Loading projects...
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            No matching projects found.
          </div>
        )}

        <div className="space-y-5">
          {filteredProjects.map((project) => {
            const status = getStatus(project);

            return (
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
                      {project.app_type || "Custom SaaS App"} • {status}
                    </p>

                    <p className="mt-2 text-sm text-zinc-600">
                      {project.created_at
                        ? new Date(project.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="rounded-xl bg-blue-600 px-5 py-3 text-center font-bold hover:bg-blue-700"
                    >
                      Continue Building
                    </Link>

                    <ProjectCardActions project={project} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}