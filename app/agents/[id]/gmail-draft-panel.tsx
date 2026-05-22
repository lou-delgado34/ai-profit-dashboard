"use client";

import { useState } from "react";
import Link from "next/link";

export default function GmailDraftPanel({ agentId }: { agentId: string }) {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const createDraft = async () => {
    setLoading(true);
    setDraft("");

    const response = await fetch("/api/create-gmail-draft-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId,
        recipient,
        purpose,
        context,
      }),
    });

    const data = await response.json();

    setDraft(data.draft || "Draft failed.");
    setLoading(false);
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-2xl font-black">Gmail Draft</h2>

      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient email..."
        className="mb-3 w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      />

      <input
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Purpose of email..."
        className="mb-3 w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      />

      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Context for the email..."
        className="h-32 w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      />

      <button
        onClick={createDraft}
        disabled={loading || !purpose.trim()}
        className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating Draft..." : "Create Gmail Draft Action"}
      </button>

      {draft && (
        <div className="mt-5 rounded-2xl border border-green-800 bg-green-950/30 p-4">
          <h3 className="mb-3 text-xl font-black text-green-300">
            Draft Saved to Action Queue
          </h3>

          <pre className="whitespace-pre-wrap text-sm text-green-100">
            {draft}
          </pre>

          <Link
            href="/actions"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
          >
            Open Action Queue
          </Link>
        </div>
      )}
    </div>
  );
}