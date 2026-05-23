"use client";

import JSZip from "jszip";

export default function ProjectExportPackage({
  project,
}: {
  project: any;
}) {
  const safeName = (project.title || "ai-project")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase();

  const downloadZip = async () => {
    const zip = new JSZip();

    zip.file("README.txt", `Project: ${project.title}\n\nPrompt:\n${project.prompt}`);

    zip.file(
      "build-pack.json",
      JSON.stringify(project.build_pack || {}, null, 2)
    );

    zip.file(
      "generated-files.json",
      JSON.stringify(project.generated_files || {}, null, 2)
    );

    const files = project.generated_files || {};

    [...(files.pages || []), ...(files.components || []), ...(files.apiRoutes || []), ...(files.sql || [])].forEach(
      (file: any) => {
        if (file.filename && file.code) {
          zip.file(file.filename, file.code);
        }
      }
    );

    if (files.env?.length) {
      zip.file(
        ".env.example",
        files.env.map((item: any) => `${item.key}=`).join("\n")
      );
    }

    if (files.launchChecklist?.length) {
      zip.file(
        "LAUNCH-CHECKLIST.txt",
        files.launchChecklist.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")
      );
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}-build-pack.zip`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="text-2xl font-black">Export Package</h2>

      <p className="mt-3 text-zinc-400">
        Download the generated app files, build pack, SQL, environment example, and launch checklist.
      </p>

      <button
        onClick={downloadZip}
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
      >
        Download Full Build ZIP
      </button>
    </section>
  );
}