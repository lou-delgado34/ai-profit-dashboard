"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditablePromptBox({
  id,
  currentPrompt,
}: {
  id: string;
  currentPrompt: string;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(currentPrompt);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const savePrompt = async () => {
    setSaving(true);

    await fetch("/api/update-project-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, prompt }),
    });

    setSaving(false);
    router.refresh();
  };

  const regenerateWithEditedPrompt = async () => {
    setRegenerating(true);

    await fetch("/api/update-project-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, prompt }),
    });

    await fetch("/api/regenerate-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, prompt }),
    });

    setRegenerating(false);
    router.refresh();
  };

  return (
    <div>
      <h2 className="mb-3 text-xl font-black">Editable Prompt</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="h-60 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={savePrompt}
          disabled={saving}
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Prompt"}
        </button>

        <button
          onClick={regenerateWithEditedPrompt}
          disabled={regenerating}
          className="rounded-xl bg-orange-600 px-5 py-3 font-bold hover:bg-orange-700 disabled:opacity-50"
        >
          {regenerating ? "Regenerating..." : "Save + Regenerate"}
        </button>
      </div>
    </div>
  );
}