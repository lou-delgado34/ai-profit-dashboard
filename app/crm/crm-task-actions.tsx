"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CrmTaskActions({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const completeTask = async () => {
    setLoading(true);

    const res = await fetch("/api/complete-crm-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Could not complete task.");
      return;
    }

    router.refresh();
  };

  return (
    <button
      onClick={completeTask}
      disabled={loading}
      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Completing..." : "Complete"}
    </button>
  );
}