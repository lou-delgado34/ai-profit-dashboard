export default function BuildPackViewer({ buildPack }: { buildPack: any }) {
  const hasBuildPack = buildPack && Object.keys(buildPack).length > 0;

  if (!hasBuildPack) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-2xl font-black">Build Pack</h2>
        <p className="mt-3 text-zinc-400">
          No build pack yet. Click Generate Build Pack.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
          Build Pack
        </p>

        <h2 className="mt-2 text-4xl font-black">
          {buildPack.appName || "Generated App"}
        </h2>

        <p className="mt-4 text-zinc-400">
          {buildPack.summary}
        </p>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="mb-4 text-2xl font-black">Pages</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {(buildPack.pages || []).map((page: any, index: number) => (
            <div key={index} className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h4 className="text-xl font-black">{page.name}</h4>
              <p className="mt-2 text-sm text-blue-400">{page.route}</p>
              <p className="mt-3 text-zinc-400">{page.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="mb-4 text-2xl font-black">Database Tables</h3>

        <div className="space-y-4">
          {(buildPack.database || []).map((table: any, index: number) => (
            <div key={index} className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h4 className="text-xl font-black">{table.table}</h4>
              <p className="mt-2 text-zinc-400">{table.purpose}</p>
              <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-zinc-950 p-3 text-sm text-zinc-300">
                {(table.columns || []).join("\n")}
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="mb-4 text-2xl font-black">API Routes</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {(buildPack.apiRoutes || []).map((api: any, index: number) => (
            <div key={index} className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h4 className="text-xl font-black">{api.route}</h4>
              <p className="mt-2 text-sm text-green-400">{api.method}</p>
              <p className="mt-3 text-zinc-400">{api.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="mb-4 text-2xl font-black">Components</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {(buildPack.components || []).map((component: any, index: number) => (
            <div key={index} className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h4 className="text-xl font-black">{component.name}</h4>
              <p className="mt-3 text-zinc-400">{component.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="mb-4 text-2xl font-black">Launch Steps</h3>

        <ol className="space-y-3">
          {(buildPack.launchSteps || []).map((step: string, index: number) => (
            <li key={index} className="rounded-xl bg-black p-4 text-zinc-300">
              <strong>{index + 1}.</strong> {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}