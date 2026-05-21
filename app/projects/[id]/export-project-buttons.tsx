"use client";

import JSZip from "jszip";

export default function ExportProjectButtons({
  title,
  prompt,
  result,
}: {
  title: string;
  prompt: string;
  result: string;
}) {
  const safeTitle = title.replace(/[^a-z0-9]/gi, "-").toLowerCase();

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadZip = async () => {
    const zip = new JSZip();

    zip.file("README.txt", `PROJECT TITLE:\n${title}\n\nPROMPT:\n${prompt}`);
    zip.file("prompt.txt", prompt);
    zip.file("full-ai-output.txt", result);
    zip.file("build-notes.txt", "Use this export as your app blueprint. Copy the SQL into Supabase and the code sections into your Next.js project.");

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeTitle}-export.zip`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-2xl font-black">Export</h2>

      <div className="grid gap-3">
        <button
          onClick={downloadZip}
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
        >
          Download ZIP Package
        </button>

        <button
          onClick={() => downloadFile(`${safeTitle}-prompt.txt`, prompt)}
          className="rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-700"
        >
          Download Prompt
        </button>

        <button
          onClick={() => downloadFile(`${safeTitle}-full-plan.txt`, result)}
          className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
        >
          Download Full Plan
        </button>
      </div>
    </div>
  );
}