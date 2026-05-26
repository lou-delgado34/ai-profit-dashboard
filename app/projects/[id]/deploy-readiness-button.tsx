"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeployReadinessButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    setLoading(true);

    const res = await fetch("/api/validate-deploy-readiness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Validation failed.");
      return;
    }

    router.refresh();
    alert("Deploy readiness checked.");
  };

  return (
    <button
      onClick={validate}
      disabled={loading}
      className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Checking..." : "Check Deploy Readiness"}
    </button>
  );
}