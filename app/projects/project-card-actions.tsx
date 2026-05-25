"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectCardActions({
  project,
}: {
  project: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const renameProject = async () => {
    const newTitle = prompt("New project name:", project.title || "");

    if (!newTitle) return;

    setLoading(true);

    await fetch("/api/rename-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project.id,
        title: newTitle,
      }),
    });

    setLoading(false);
    router.refresh();
  };

  const duplicateProject = async () => {
    setLoading(true);

    const res = await fetch("/api/duplicate-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: project.id }),
    });

    const data = await res.json();

    setLoading(false);

    if (data?.project?.id) {
      router.push(`/projects/${data.project.id}`);
    } else {
      router.refresh();
    }
  };

  const deleteProject = async () => {
    if (!confirm("Delete this project?")) return;

    setLoading(true);

    await fetch("/api/delete-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: project.id }),
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={renameProject}
        disabled={loading}
        className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700 disabled:opacity-50"
      >
        Rename
      </button>

      <button
        onClick={duplicateProject}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        Duplicate
      </button>

      <button
        onClick={deleteProject}
        disabled={loading}
        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}