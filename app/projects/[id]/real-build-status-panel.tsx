"use client";

import JSZip from "jszip";

export default function RealBuildStatusPanel({
  project,
  buildJob,
}: {
  project: any;
  buildJob: any;
}) {
  const downloadDeployPackage = async () => {
    const zip = new JSZip();
    const files = project.generated_files || {};

    zip.file("README.txt", `Project: ${project.title}\n\n${project.prompt}`);
    zip.file("build-pack.json", JSON.stringify(project.build_pack || {}, null, 2));
    zip.file("generated-files.json", JSON.stringify(files || {}, null, 2));

    [...(files.pages || []), ...(files.components || []), ...(files.apiRoutes || []), ...(files.sql || [])].forEach(
      (file: any) => {
        if (file.filename && file.code) zip.file(file.filename, file.code);
      }
    );

    if (files.env?.length) {
      zip.file(".env.example", files.env.map((e: any) => `${e.key}=`).join("\n"));
    }

    if (files.installCommands?.length) {
      zip.file("INSTALL-COMMANDS.txt", files.installCommands.join("\n"));
    }

    if (files.launchChecklist?.length) {
      zip.file(
        "LAUNCH-CHECKLIST.txt",
        files.launchChecklist.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")
      );
    }

    if (files.securityChecklist?.length) {
      zip.file(
        "SECURITY-CHECKLIST.txt",
        files.securityChecklist.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")
      );
    }

    if (files.testingChecklist?.length) {
      zip.file(
        "TESTING-CHECKLIST.txt",
        files.testingChecklist.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")
      );
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const safeName = (project.title || "real-app")
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();

    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}-deploy-package.zip`;
    a.click();

    URL.revokeObjectURL(url);
  };

  if (!buildJob) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
          Real Build
        </p>

        <h2 className="mt-2 text-3xl font-black">Not Started Yet</h2>

        <p className="mt-3 text-zinc-400">
          Go to Overview and click Build Real App.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-orange-800 bg-orange-950/20 p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
        Real Build Engine
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {buildJob.status}
      </h2>

      <p className="mt-2 text-zinc-400">
        Step: {buildJob.step}
      </p>

      <button
        onClick={downloadDeployPackage}
        className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-bold hover:bg-orange-700"
      >
        Download Deploy Package
      </button>

      <div className="mt-6 space-y-3">
        {(buildJob.logs || []).map((item: any, index: number) => (
          <div key={index} className="rounded-2xl border border-zinc-800 bg-black p-4">
            <p className="text-sm text-zinc-500">{item.time}</p>
            <p className="mt-1 font-bold">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}