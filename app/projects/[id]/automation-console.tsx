"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AutomationConsole({
  projectId,
  jobs,
}: {
  projectId: string;
  jobs: any[];
}) {
  const router = useRouter();
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);

  const createJob = async () => {
    if (!command.trim()) {
      alert("Type an automation command first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-automation-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        command,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Could not create automation job.");
      return;
    }

    setCommand("");
    router.refresh();
  };

  const runJob = async (jobId: string) => {
    setLoading(true);

    const res = await fetch("/api/run-automation-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Could not run automation job.");
      return;
    }

    router.refresh();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-blue-800 bg-blue-950/20 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
          AI Automation Console
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Command Queue
        </h2>

        <p className="mt-3 text-zinc-400">
          Add automation commands for this project.
        </p>

        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Example: Create follow-up workflow for new CRM leads."
          className="mt-5 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none"
        />

        <button
          onClick={createJob}
          disabled={loading}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Working..." : "Add Automation Job"}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-2xl font-black">Automation Jobs</h3>

        <div className="mt-5 space-y-4">
          {jobs.length === 0 ? (
            <p className="text-zinc-400">No automation jobs yet.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-zinc-800 bg-black p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-bold">{job.command}</p>

                    <p className="mt-2 text-sm uppercase text-blue-400">
                      Status: {job.status}
                    </p>

                    {job.result?.summary && (
                      <p className="mt-3 text-zinc-300">
                        {job.result.summary}
                      </p>
                    )}
                  </div>

                  {job.status !== "completed" && (
                    <button
                      onClick={() => runJob(job.id)}
                      disabled={loading}
                      className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                      Run Job
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {(job.logs || []).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl bg-zinc-950 p-3 text-sm text-zinc-400"
                    >
                      {item.time} — {item.message}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}