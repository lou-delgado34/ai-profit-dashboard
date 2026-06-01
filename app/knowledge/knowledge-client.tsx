"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function KnowledgeClient({
  knowledge,
}: {
  knowledge: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "general",
    content: "",
  });

  async function saveKnowledge() {
    if (!form.title || !form.content) {
      alert("Add title and content.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-knowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not save knowledge.");
      return;
    }

    setForm({
      title: "",
      category: "general",
      content: "",
    });

    router.refresh();
    alert("Knowledge saved.");
  }

  async function deleteKnowledge(knowledgeId: string) {
    const ok = confirm("Delete this knowledge item?");
    if (!ok) return;

    setLoading(true);

    const res = await fetch("/api/delete-knowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ knowledgeId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not delete knowledge.");
      return;
    }

    router.refresh();
    alert("Knowledge deleted.");
  }

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-3xl font-black">Add Knowledge</h2>

        <input
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          placeholder="Title. Example: Term Life Recruiting Script"
          className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        >
          <option value="general">General</option>
          <option value="term_life">Term Life</option>
          <option value="recruiting">Recruiting</option>
          <option value="scripts">Scripts</option>
          <option value="spanish">Spanish</option>
          <option value="compliance">Compliance</option>
          <option value="training">Training</option>
        </select>

        <textarea
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
          placeholder="Paste the training, script, presentation notes, or business instructions here."
          className="mt-3 min-h-72 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        />

        <button
          onClick={saveKnowledge}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-orange-600 px-5 py-4 font-bold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Knowledge"}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-3xl font-black">Saved Knowledge</h2>

        <div className="mt-5 space-y-4">
          {knowledge.length === 0 ? (
            <p className="text-zinc-500">No knowledge saved yet.</p>
          ) : (
            knowledge.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-800 bg-black p-5"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xl font-black">{item.title}</p>
                    <p className="mt-1 text-sm font-bold text-orange-300">
                      {item.category} • {item.status}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteKnowledge(item.id)}
                    className="rounded-xl bg-red-600 px-4 py-3 font-bold"
                  >
                    Delete
                  </button>
                </div>

                <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-zinc-950 p-4 text-sm leading-7 text-zinc-300">
                  {item.content}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}