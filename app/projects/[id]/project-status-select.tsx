"use client";

import { useRouter } from "next/navigation";

export default function ProjectStatusSelect({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const updateStatus = async (project_status: string) => {
    await fetch("/api/update-project-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, project_status }),
    });

    router.refresh();
  };

  return (
    <div className="mt-6">
      <label className="mb-2 block font-bold">Project Status</label>

      <select
        defaultValue={currentStatus || "draft"}
        onChange={(e) => updateStatus(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      >
        <option value="draft">Draft</option>
        <option value="building">Building</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}