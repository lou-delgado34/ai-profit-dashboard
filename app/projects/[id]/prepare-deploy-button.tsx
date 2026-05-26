"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrepareDeployButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const prepare = async () => {
    setLoading(true);

    const res = await fetch("/api/prepare-deploy-package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Deploy prep failed.");
      return;
    }

    router.refresh();
    alert("Deploy package prepared.");
  };

  return (
    <button
      onClick={prepare}
      disabled={loading}
      className="rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-700 disabled:opacity-50"
    >
      {loading ? "Preparing..." : "Prepare Deploy Package"}
    </button>
  );
}