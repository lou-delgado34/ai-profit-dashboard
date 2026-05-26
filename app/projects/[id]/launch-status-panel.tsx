export default function LaunchStatusPanel({
  project,
}: {
  project: any;
}) {
  const logs = project.launch_logs || [];

  return (
    <section className="rounded-3xl border border-green-800 bg-green-950/20 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-green-400">
        Launch Status
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {project.launch_status || "not_launched"}
      </h2>

      {project.launch_error && (
        <div className="mt-5 rounded-2xl border border-red-800 bg-red-950/40 p-4 text-red-200">
          {project.launch_error}
        </div>
      )}

      {project.deployment_url && (
        <a
          href={project.deployment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
        >
          Open Live App
        </a>
      )}

      <div className="mt-6 space-y-3">
        {logs.length === 0 ? (
          <p className="text-zinc-400">No launch logs yet.</p>
        ) : (
          logs.map((item: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-800 bg-black p-4"
            >
              <p className="text-sm text-zinc-500">
                {item.time || ""}
              </p>

              <p className="mt-1 font-bold text-zinc-200">
                {item.message || item}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}