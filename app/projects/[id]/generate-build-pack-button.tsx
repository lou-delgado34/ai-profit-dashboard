"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateBuildPackButton({
  projectId,
  prompt,
}: {
  projectId: string;
  prompt: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    await fetch("/api/generate-build-pack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        prompt,
      }),
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Generating Build Pack..." : "Generate Build Pack"}
    </button>
  );
}