"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartRealBuildButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startBuild = async () => {
    setLoading(true);

    const res = await fetch("/api/start-real-app-build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Build failed.");
      return;
    }

    router.refresh();
    alert("Real app build started.");
  };

  return (
    <button
      onClick={startBuild}
      disabled={loading}
      className="rounded-xl bg-orange-600 px-5 py-3 font-bold hover:bg-orange-700 disabled:opacity-50"
    >
      {loading ? "Starting Build..." : "Build Real App"}
    </button>
  );
}