"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeploymentUrlForm({
  projectId,
  currentUrl,
}: {
  projectId: string;
  currentUrl?: string;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(currentUrl || "");
  const [loading, setLoading] = useState(false);

  const saveUrl = async () => {
    if (!url.trim()) {
      alert("Paste your live deployment URL first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/save-deployment-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        deploymentUrl: url.trim(),
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not save URL.");
      return;
    }

    router.refresh();
    alert("Deployment URL saved.");
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
        Live URL Tracker
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Deployment URL
      </h2>

      <p className="mt-3 text-zinc-400">
        Paste the live app URL after deployment so this project tracks it.
      </p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://your-app.vercel.app"
        className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none"
      />

      <button
        onClick={saveUrl}
        disabled={loading}
        className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Live URL"}
      </button>

      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          className="mt-5 block rounded-2xl border border-green-800 bg-green-950/30 p-4 font-bold text-green-300"
        >
          Open Live App: {currentUrl}
        </a>
      )}
    </div>
  );
}