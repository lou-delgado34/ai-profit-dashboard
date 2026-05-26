"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GoLiveButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const goLive = async () => {
    setLoading(true);

    const res = await fetch("/api/go-live", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Launch failed.");
      return;
    }

    router.refresh();
    alert("Project marked launch-ready.");
  };

  return (
    <button
      onClick={goLive}
      disabled={loading}
      className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Launching..." : "Go Live"}
    </button>
  );
}