"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminBuildControls({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const resetBuild = async () => {
    if (!confirm("Reset build data for this project?")) return;

    setLoading(true);

    await fetch("/api/reset-project-build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <section className="rounded-3xl border border-red-900 bg-red-950/20 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-red-400">
        Admin Controls
      </p>

      <h2 className="mt-2 text-3xl font-black">Project Build Admin</h2>

      <p className="mt-3 text-zinc-400">
        Use this only when a project needs to be regenerated.
      </p>

      <button
        onClick={resetBuild}
        disabled={loading}
        className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-bold hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Build Data"}
      </button>
    </section>
  );
}