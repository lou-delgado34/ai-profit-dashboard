"use client";

import { useState } from "react";

export default function AiRecommendationsPanel({
  recommendations,
}: {
  recommendations: any[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-4 rounded-2xl border border-yellow-800 bg-yellow-950/20 p-4">
      <button
        onClick={() => setOpen(!open)}
        className="font-bold text-yellow-300"
      >
        AI Recommendations {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {recommendations.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No AI recommendations yet.
            </p>
          ) : (
            recommendations.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-800 bg-black p-4"
              >
                <p className="font-bold text-yellow-300">
                  {item.title}
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">
                  {item.recommendation}
                </p>

                <p className="mt-2 text-xs uppercase text-zinc-500">
                  {item.recommendation_type} • {item.priority}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}