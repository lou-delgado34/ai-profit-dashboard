"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentMemoryPanel({
  agentId,
  memories,
}: {
  agentId: string;
  memories: {
    id: string;
    title: string;
    content: string;
    created_at: string;
  }[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const addMemory = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);

    await fetch("/api/add-agent-memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId,
        title,
        content,
      }),
    });

    setTitle("");
    setContent("");
    setSaving(false);
    router.refresh();
  };

  const deleteMemory = async (id: string) => {
    const confirmed = confirm("Delete this memory?");
    if (!confirmed) return;

    await fetch("/api/delete-agent-memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    router.refresh();
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-2xl font-black">
        Agent Memory
      </h2>

      <div className="rounded-2xl border border-zinc-800 bg-black p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Memory title..."
          className="mb-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What should this agent remember?"
          className="h-28 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        />

        <button
          onClick={addMemory}
          disabled={saving || !title.trim() || !content.trim()}
          className="mt-3 rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Memory"}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {memories.length === 0 ? (
          <p className="text-zinc-500">
            No memory saved yet.
          </p>
        ) : (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-2xl border border-zinc-800 bg-black p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black">{memory.title}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">
                    {memory.content}
                  </p>
                </div>

                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}