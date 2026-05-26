"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/get-projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []));
  }, []);

  const openProject = (id: string) => {
    window.location.href = `/projects/${id}`;
  };

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">Home</Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Projects</Link>
          <Link href="/agents" className="rounded-xl bg-green-600 px-5 py-3 font-bold">Agents</Link>
          <Link href="/actions" className="rounded-xl bg-pink-600 px-5 py-3 font-bold">Actions</Link>
        </nav>

        <h1 className="text-5xl font-black">Projects Dashboard</h1>
        <p className="mt-4 text-zinc-400">Click Continue Building to open a project.</p>

        <div className="mt-10 space-y-5">
          {projects.map((project) => (
            <div key={project.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-3xl font-black">{project.title}</h2>
              <p className="mt-3 text-zinc-400">{project.prompt}</p>

              <button
                onClick={() => openProject(project.id)}
                className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
              >
                Continue Building
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}