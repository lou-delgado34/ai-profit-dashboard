"use client";

import { useRouter } from "next/navigation";

export default function AgentStatusSelect({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const updateStatus = async (status: string) => {
    await fetch("/api/update-agent-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    router.refresh();
  };

  return (
    <div>
      <label className="mb-2 block font-bold">Agent Status</label>

      <select
        defaultValue={currentStatus || "draft"}
        onChange={(e) => updateStatus(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      >
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
      </select>
    </div>
  );
}