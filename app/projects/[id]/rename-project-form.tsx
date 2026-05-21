"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RenameProjectForm({
  id,
  currentTitle,
}: {
  id: string;
  currentTitle: string;
}) {
  const [title, setTitle] = useState(currentTitle);
  const router = useRouter();

  const renameProject = async () => {
    await fetch("/api/rename-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title,
      }),
    });

    alert("Project renamed!");
    router.refresh();
  };

  return (
    <div className="mt-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      />

      <button
        onClick={renameProject}
        className="mt-3 rounded-xl bg-yellow-600 px-5 py-3 font-bold hover:bg-yellow-700"
      >
        Rename Project
      </button>
    </div>
  );
}