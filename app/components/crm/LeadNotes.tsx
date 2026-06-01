"use client";

import { useEffect, useState } from "react";

export default function LeadNotes({ leadId }: { leadId: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadNotes() {
    if (!leadId) return;

    const res = await fetch("/api/get-lead-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ leadId }),
    });

    const data = await res.json();

    setNotes(data.notes || []);
  }

  async function addNote() {
    if (!newNote.trim()) return;

    setLoading(true);

    const res = await fetch("/api/add-lead-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadId,
        note: newNote,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Unable to save note.");
      return;
    }

    setNewNote("");
    loadNotes();
  }

  useEffect(() => {
    loadNotes();
  }, [leadId]);

  return (
    <section className="rounded-3xl border border-zinc-800 bg-black p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-green-400">
            Notes
          </p>

          <h3 className="mt-1 text-2xl font-black">
            Lead Notes
          </h3>
        </div>
      </div>

      <div className="mt-5">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add note..."
          className="min-h-28 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white outline-none focus:border-green-500"
        />

        <button
          onClick={addNote}
          disabled={loading}
          className="mt-3 rounded-2xl bg-green-600 px-5 py-3 font-bold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Note"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No notes yet.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <p className="text-sm leading-6 text-zinc-300">
                {note.note}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}