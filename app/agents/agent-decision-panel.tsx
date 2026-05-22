"use client";

import { useState } from "react";

export default function AgentDecisionPanel({
  decisions,
}: {
  decisions: any[];
}) {
  const [situation, setSituation] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const makeDecision = async () => {
    setLoading(true);
    setRecommendation("");

    const response = await fetch("/api/make-agent-decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ situation }),
    });

    const data = await response.json();

    setRecommendation(data.recommendation || "Decision failed.");
    setLoading(false);
  };

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="mb-4 text-3xl font-black">
        Superagent Decision Brain
      </h2>

      <p className="mb-5 text-zinc-400">
        Tell the system what is happening. It will choose the best agent, chain,
        and next action.
      </p>

      <textarea
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        placeholder="Example: A lead said they are interested in term life insurance but need to talk to their spouse first. What should my agent team do?"
        className="h-36 w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      />

      <button
        onClick={makeDecision}
        disabled={loading || !situation.trim()}
        className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Get Best Decision"}
      </button>

      {recommendation && (
        <div className="mt-6 rounded-2xl border border-green-800 bg-green-950/30 p-5">
          <h3 className="mb-3 text-2xl font-black text-green-300">
            Decision Output
          </h3>

          <pre className="whitespace-pre-wrap text-sm leading-6 text-green-100">
            {recommendation}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-black">
          Recent Decisions
        </h3>

        {decisions.length === 0 ? (
          <p className="text-zinc-500">No decisions yet.</p>
        ) : (
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="rounded-2xl border border-zinc-800 bg-black p-4"
              >
                <p className="text-sm text-zinc-500">
                  {new Date(decision.created_at).toLocaleString()}
                </p>

                <p className="mt-3 font-bold text-zinc-300">
                  Situation:
                </p>

                <p className="mt-1 text-zinc-400">
                  {decision.situation}
                </p>

                <details className="mt-3">
                  <summary className="cursor-pointer font-bold text-green-400">
                    View Recommendation
                  </summary>

                  <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-zinc-950 p-4 text-sm text-zinc-300">
                    {decision.recommendation}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}