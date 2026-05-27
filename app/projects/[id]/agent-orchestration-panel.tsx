"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AgentOrchestrationPanel({
  projectId,
  activities,
}: {
  projectId: string;
  activities: any[];
}) {
  const router = useRouter();
  const [agentName, setAgentName] = useState("CRM Agent");
  const [activityType, setActivityType] = useState("workflow");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const runAgent = async () => {
    if (!input.trim()) {
      alert("Type an agent task first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/run-ai-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, agentName, activityType, input }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Agent failed.");
      return;
    }

    setInput("");
    router.refresh();
    alert("Agent task completed.");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-purple-800 bg-purple-950/20 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-purple-400">
          AI Agent Orchestration
        </p>

        <h2 className="mt-2 text-3xl font-black">Run Agent Task</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <select
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          >
            <option>CRM Agent</option>
            <option>Follow-Up Agent</option>
            <option>Compliance Agent</option>
            <option>Marketing Agent</option>
            <option>Admin Agent</option>
          </select>

          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          >
            <option value="workflow">Workflow</option>
            <option value="follow_up">Follow-Up</option>
            <option value="review">Review</option>
            <option value="task">Task</option>
          </select>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: Build a 3-step follow-up workflow for new life insurance leads."
          className="mt-5 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        />

        <button
          onClick={runAgent}
          disabled={loading}
          className="mt-4 rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run AI Agent"}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-2xl font-black">Production Activity Feed</h3>

        <div className="mt-5 space-y-4">
          {activities.length === 0 ? (
            <p className="text-zinc-400">No agent activity yet.</p>
          ) : (
            activities.map((item) => (
              <div key={item.id} className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="font-bold">{item.agent_name}</p>
                <p className="mt-1 text-sm uppercase text-purple-400">
                  {item.activity_type} • {item.status}
                </p>
                <p className="mt-3 text-zinc-400">{item.input}</p>
                {item.output?.summary && (
                  <p className="mt-3 font-bold text-green-300">{item.output.summary}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}