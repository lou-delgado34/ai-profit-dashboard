export default function DeploymentStatusPanel({
  project,
}: {
  project: any;
}) {
  const checklist = project.deployment_checklist || [];
  const notes = project.deploy_notes || [];
  const logs = project.deployment_logs || [];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-green-400">
          Deployment Status
        </p>

        <h2 className="mt-2 text-3xl font-black">
          {project.deployment_status || "not_started"}
        </h2>

        <p className="mt-3 text-zinc-400">
          SQL Status: {project.sql_status || "not_started"}
        </p>

        <p className="mt-3 text-zinc-400">
          Package Status: {project.deploy_package_status || "not_started"}
        </p>

        {project.deploy_error && (
          <div className="mt-4 rounded-2xl border border-red-800 bg-red-950/30 p-4 text-red-300">
            Error: {project.deploy_error}
          </div>
        )}

        {project.deployment_url && (
          <a
            href={project.deployment_url}
            target="_blank"
            className="mt-5 inline-block rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
          >
            Open Live App
          </a>
        )}
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-2xl font-black">Deploy Checklist</h3>

        <div className="mt-5 space-y-3">
          {checklist.length === 0 ? (
            <p className="text-zinc-400">
              No checklist yet.
            </p>
          ) : (
            checklist.map((item: any, index: number) => (
              <div key={index} className="rounded-2xl bg-black p-4">
                {item.passed ? "✅" : "❌"} {item.label}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-2xl font-black">Deployment Logs</h3>

        <div className="mt-5 space-y-3">
          {logs.length === 0 ? (
            <p className="text-zinc-400">No deploy logs yet.</p>
          ) : (
            logs.map((log: string, index: number) => (
              <div key={index} className="rounded-2xl bg-black p-4 text-zinc-300">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-2xl font-black">Deploy Notes</h3>

        <div className="mt-5 space-y-3">
          {notes.length === 0 ? (
            <p className="text-zinc-400">No deployment notes yet.</p>
          ) : (
            notes.map((note: string, index: number) => (
              <div key={index} className="rounded-2xl bg-black p-4 text-zinc-300">
                {note}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}