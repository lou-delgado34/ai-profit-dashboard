"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-projects");

    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-6xl font-black mb-2">
          Projects
        </h1>

        <p className="text-zinc-400 mb-10">
          Open one project at a time and continue building it.
        </p>

        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-zinc-800 bg-zinc-950 rounded-3xl p-8"
            >
              <h2 className="text-4xl font-black mb-3">
                {project.title}
              </h2>

              <p className="text-zinc-400 mb-6">
                {project.prompt}
              </p>

              <div className="flex gap-4">

                <div className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold">
                  {project.status || "Draft"}
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-bold"
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