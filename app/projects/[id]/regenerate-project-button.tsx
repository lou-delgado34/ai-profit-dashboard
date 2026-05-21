"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegenerateProjectButton({
  id,
  prompt,
}: {
  id: string;
  prompt: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const regenerate = async () => {
    setLoading(true);

    await fetch("/api/regenerate-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, prompt }),
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={regenerate}
      disabled={loading}
      className="rounded-xl bg-orange-600 px-5 py-3 font-bold hover:bg-orange-700 disabled:opacity-50"
    >
      {loading ? "Regenerating..." : "Regenerate Plan"}
    </button>
  );
}