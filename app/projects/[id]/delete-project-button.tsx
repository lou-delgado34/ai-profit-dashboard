"use client";

import { useRouter } from "next/navigation";

export default function DeleteProjectButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  const deleteProject = async () => {
    const confirmed = confirm("Delete this project?");

    if (!confirmed) return;

    await fetch("/api/delete-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    router.push("/projects");
    router.refresh();
  };

  return (
    <button
      onClick={deleteProject}
      className="rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-700"
    >
      Delete Project
    </button>
  );
}