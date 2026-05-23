"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateProjectFilesButton({
  projectId,
  prompt,
  buildPack,
}: {
  projectId: string;
  prompt: string;
  buildPack: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generateFiles = async () => {
    setLoading(true);

    await fetch("/api/generate-project-files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        prompt,
        buildPack,
      }),
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={generateFiles}
      disabled={loading}
      className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Generating Files..." : "Generate Code Files"}
    </button>
  );
}