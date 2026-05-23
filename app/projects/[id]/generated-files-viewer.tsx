"use client";

import { useState } from "react";

function FileCard({
  title,
  files,
}: {
  title: string;
  files: any[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!files || files.length === 0) {
    return null;
  }

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code || "");
    alert("Copied!");
  };

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="mb-5 text-2xl font-black">{title}</h3>

      <div className="grid gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-800 bg-black p-5"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left"
            >
              <h4 className="text-xl font-black text-blue-300">
                {file.filename || file.key || "Untitled File"}
              </h4>

              <p className="mt-2 text-sm text-zinc-500">
                {file.description}
              </p>
            </button>

            {openIndex === index && (
              <div className="mt-5">
                <button
                  onClick={() => copyCode(file.code || `${file.key}=`)}
                  className="mb-3 rounded-xl bg-blue-600 px-4 py-2 font-bold hover:bg-blue-700"
                >
                  Copy
                </button>

                <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
                  {file.code || `${file.key} - ${file.description}`}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function GeneratedFilesViewer({
  generatedFiles,
}: {
  generatedFiles: any;
}) {
  const hasFiles =
    generatedFiles &&
    Object.keys(generatedFiles).length > 0 &&
    (
      generatedFiles.pages?.length ||
      generatedFiles.components?.length ||
      generatedFiles.apiRoutes?.length ||
      generatedFiles.sql?.length
    );

  if (!hasFiles) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-2xl font-black">Generated Code Files</h2>
        <p className="mt-3 text-zinc-400">
          No files generated yet. Click Generate Code Files.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-green-800 bg-green-950/30 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-green-400">
          Generated Files
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Copy-Paste Build Sections
        </h2>

        <p className="mt-3 text-green-100">
          These are safe JSON-stored code sections. Copy each file into your app when ready.
        </p>
      </section>

      <FileCard title="Pages" files={generatedFiles.pages || []} />
      <FileCard title="Components" files={generatedFiles.components || []} />
      <FileCard title="API Routes" files={generatedFiles.apiRoutes || []} />
      <FileCard title="Supabase SQL" files={generatedFiles.sql || []} />
      <FileCard title="Environment Variables" files={generatedFiles.env || []} />

      {generatedFiles.installCommands?.length > 0 && (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="mb-4 text-2xl font-black">Install Commands</h3>

          <pre className="whitespace-pre-wrap rounded-2xl bg-black p-5 text-sm text-zinc-300">
            {generatedFiles.installCommands.join("\n")}
          </pre>
        </section>
      )}

      {generatedFiles.launchChecklist?.length > 0 && (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="mb-4 text-2xl font-black">Launch Checklist</h3>

          <ol className="space-y-3">
            {generatedFiles.launchChecklist.map((step: string, index: number) => (
              <li key={index} className="rounded-xl bg-black p-4 text-zinc-300">
                <strong>{index + 1}.</strong> {step}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}