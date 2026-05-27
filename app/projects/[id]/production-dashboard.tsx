"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductionDashboard({
  project,
  notifications,
}: {
  project: any;
  notifications: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const runHealthCheck = async () => {
    setLoading(true);

    const res = await fetch("/api/production-health-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Health check failed.");
      return;
    }

    router.refresh();
    alert("Health check complete.");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-green-800 bg-green-950/20 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-green-400">
          Production Dashboard
        </p>

        <h2 className="mt-2 text-3xl font-black">
          System Health: {project.health_status || "healthy"}
        </h2>

        <button
          onClick={runHealthCheck}
          disabled={loading}
          className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Run Health Check"}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-2xl font-black">Health Logs</h3>

        <div className="mt-5 space-y-3">
          {(project.health_logs || []).length === 0 ? (
            <p className="text-zinc-400">No health logs yet.</p>
          ) : (
            project.health_logs.map((item: any, index: number) => (
              <div key={index} className="rounded-2xl bg-black p-4 text-zinc-300">
                {item.time} — {item.message}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-2xl font-black">Notifications</h3>

        <div className="mt-5 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-zinc-400">No notifications yet.</p>
          ) : (
            notifications.map((note) => (
              <div key={note.id} className="rounded-2xl bg-black p-4">
                <p className="font-bold">{note.title}</p>
                <p className="mt-2 text-zinc-400">{note.message}</p>
                <p className="mt-2 text-xs text-zinc-600">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}