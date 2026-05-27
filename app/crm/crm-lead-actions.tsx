"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CrmLeadActions({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const run = async (url: string) => {
    setLoading(true);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ leadId }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Action failed.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => run("/api/ai-score-lead")}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-5 py-3 font-bold"
      >
        AI Score
      </button>

      <button
        onClick={() => run("/api/generate-lead-follow-up")}
        disabled={loading}
        className="rounded-xl bg-green-600 px-5 py-3 font-bold"
      >
        Generate Follow-Up
      </button>
    </div>
  );
}