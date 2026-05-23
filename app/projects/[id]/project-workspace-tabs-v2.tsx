"use client";

export default function ProjectWorkspaceTabsV2({
  project,
  buildJob,
}: {
  project: any;
  buildJob?: any;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
        Real Build
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Phase 2 Build Tracker
      </h2>

      <p className="mt-4 text-zinc-400">
        Project: {project?.title || "Untitled Project"}
      </p>

      <p className="mt-2 text-zinc-400">
        Status: {buildJob?.status || "Not Started"}
      </p>

      <p className="mt-2 text-zinc-400">
        Step: {buildJob?.step || "Waiting"}
      </p>

      <div className="mt-6 space-y-3">
        {(buildJob?.logs || []).map((log: any, index: number) => (
          <div key={index} className="rounded-xl bg-black p-4">
            <p className="text-sm text-zinc-500">{log.time}</p>
            <p className="font-bold">{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}