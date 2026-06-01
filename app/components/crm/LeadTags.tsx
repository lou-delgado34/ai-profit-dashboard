"use client";

import { useState } from "react";

const presetTags = [
  "Hot Lead",
  "Term Life",
  "Needs Follow Up",
  "Spanish",
  "Appointment Ready",
  "Recruit",
  "Client",
];

export default function LeadTags({
  leadId,
  initialTags,
  onSaved,
}: {
  leadId: string;
  initialTags?: string[];
  onSaved?: () => void;
}) {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleTag(tag: string) {
    if (tags.includes(tag)) {
      setTags(tags.filter((item) => item !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  function addCustomTag() {
    const clean = customTag.trim();

    if (!clean) return;

    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }

    setCustomTag("");
  }

  async function saveTags() {
    setLoading(true);

    const res = await fetch("/api/update-lead-tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadId,
        tags,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Could not save tags.");
      return;
    }

    alert("Tags saved.");

    if (onSaved) {
      onSaved();
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-black p-5">
      <p className="text-sm font-bold uppercase tracking-widest text-purple-400">
        Tags
      </p>

      <h3 className="mt-1 text-2xl font-black">
        Lead Tags
      </h3>

      <div className="mt-5 flex flex-wrap gap-2">
        {presetTags.map((tag) => {
          const active = tags.includes(tag);

          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-4 py-2 text-sm font-bold ${
                active
                  ? "border-purple-500 bg-purple-600 text-white"
                  : "border-zinc-700 bg-zinc-950 text-zinc-400"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          placeholder="Custom tag"
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-500"
        />

        <button
          onClick={addCustomTag}
          className="rounded-xl bg-zinc-800 px-4 py-3 font-bold"
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-purple-950 px-3 py-1 text-xs font-bold text-purple-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={saveTags}
        disabled={loading}
        className="mt-5 rounded-2xl bg-purple-600 px-5 py-3 font-bold disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Tags"}
      </button>
    </section>
  );
}