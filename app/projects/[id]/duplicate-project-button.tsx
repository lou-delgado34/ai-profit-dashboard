"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DuplicateProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const duplicateProject = async () => {
    setLoading(true);

    const response = await fetch("/api/duplicate-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    setLoading(false);

    if (data.projectId) {
      router.push(`/projects/${data.projectId}`);
      router.refresh();
    }
  };

  return (
    <button
      onClick={duplicateProject}
      disabled={loading}
      className="rounded-xl bg-cyan-600 px-5 py-3 font-bold hover:bg-cyan-700 disabled:opacity-50"
    >
      {loading ? "Duplicating..." : "Duplicate Project"}
    </button>
  );
}