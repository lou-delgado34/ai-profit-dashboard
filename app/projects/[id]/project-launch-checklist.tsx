export default function ProjectLaunchChecklist({
  generatedFiles,
}: {
  generatedFiles: any;
}) {
  const checklist =
    generatedFiles?.launchChecklist?.length > 0
      ? generatedFiles.launchChecklist
      : [
          "Generate build pack.",
          "Generate code files.",
          "Copy SQL into Supabase.",
          "Copy page files into Next.js.",
          "Add environment variables.",
          "Run npm install.",
          "Run npm run build.",
          "Push to GitHub.",
          "Deploy to Vercel.",
          "Test live URL.",
        ];

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-green-400">
        Launch Checklist
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Project Launch Steps
      </h2>

      <div className="mt-6 space-y-3">
        {checklist.map((step: string, index: number) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-800 bg-black p-4 text-zinc-300"
          >
            <strong>{index + 1}.</strong> {step}
          </div>
        ))}
      </div>
    </section>
  );
}