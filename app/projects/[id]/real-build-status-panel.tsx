export default function RealBuildStatusPanel({
  buildJob,
}: {
  buildJob: any;
}) {
  if (!buildJob) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
          Real App Builder
        </p>

        <h2 className="mt-2 text-3xl font-black">
          No Real Build Started Yet
        </h2>

        <p className="mt-3 text-zinc-400">
          Click Build Real App after your Build Pack and Code Files are ready.
        </p>
      </section>
    );
  }

  const logs = buildJob.logs || [];

  return (
    <section className="rounded-3xl border border-orange-800 bg-orange-950/20 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
        Real App Build Status
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {buildJob.status || "Unknown"}
      </h2>

      <p className="mt-2 text-zinc-400">
        Current step: {buildJob.step || "not_started"}
      </p>

      {buildJob.error_message && (
        <div className="mt-5 rounded-2xl border border-red-800 bg-red-950/40 p-4 text-red-200">
          {buildJob.error_message}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {logs.map((item: any, index: number) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-800 bg-black p-4"
          >
            <p className="text-sm text-zinc-500">{item.time}</p>
            <p className="mt-1 font-bold text-zinc-200">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}