export default function ProductionReadinessPanel({
  project,
}: {
  project: any;
}) {
  const buildPack = project.build_pack || {};
  const generatedFiles = project.generated_files || {};

  const hasBuildPack = Object.keys(buildPack).length > 0;
  const hasFiles = Object.keys(generatedFiles).length > 0;
  const hasPages = generatedFiles.pages?.length > 0;
  const hasApi = generatedFiles.apiRoutes?.length > 0;
  const hasSql = generatedFiles.sql?.length > 0;
  const hasEnv = generatedFiles.env?.length > 0;

  const items = [
    ["Build Pack", hasBuildPack],
    ["Generated Files", hasFiles],
    ["Pages", hasPages],
    ["API Routes", hasApi],
    ["Supabase SQL", hasSql],
    ["Environment Variables", hasEnv],
  ];

  const completeCount = items.filter((item) => item[1]).length;
  const percent = Math.round((completeCount / items.length) * 100);

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-green-400">
        Production Readiness
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {percent}% Ready
      </h2>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-black">
        <div
          className="h-full rounded-full bg-green-600"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map(([label, done]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-zinc-800 bg-black p-4"
          >
            <p className="font-bold">
              {done ? "✅" : "⬜"} {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-blue-800 bg-blue-950/30 p-5">
        <h3 className="text-xl font-black text-blue-300">
          Next Best Move
        </h3>

        <p className="mt-2 text-blue-100">
          {!hasBuildPack
            ? "Generate the Build Pack."
            : !hasFiles
            ? "Generate Code Files."
            : percent < 100
            ? "Review generated sections and fill missing launch items."
            : "Download ZIP and follow the Launch Checklist."}
        </p>
      </div>
    </section>
  );
}