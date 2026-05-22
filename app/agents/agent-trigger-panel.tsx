"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentTriggerPanel({
  chains,
  triggers,
}: {
  chains: any[];
  triggers: any[];
}) {
  const router = useRouter();

  const [chainId, setChainId] = useState("");
  const [name, setName] = useState("");
  const [triggerType, setTriggerType] = useState("manual");
  const [triggerValue, setTriggerValue] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState("");

  const createTrigger = async () => {
    await fetch("/api/create-agent-trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chainId,
        name,
        triggerType,
        triggerValue,
      }),
    });

    setChainId("");
    setName("");
    setTriggerType("manual");
    setTriggerValue("");

    router.refresh();
  };

  const runTrigger = async (triggerId: string) => {
    setLoading(triggerId);
    setOutput("");

    const response = await fetch("/api/run-agent-trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        triggerId,
        input,
      }),
    });

    const data = await response.json();

    setOutput(data.output || "Trigger failed.");
    setLoading("");
  };

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="mb-4 text-3xl font-black">
        Trigger System
      </h2>

      <div className="rounded-2xl border border-zinc-800 bg-black p-5">
        <h3 className="mb-4 text-2xl font-black">
          Create Trigger
        </h3>

        <select
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
        >
          <option value="">Select chain</option>
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Trigger name..."
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
        />

        <select
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
        >
          <option value="manual">Manual</option>
          <option value="new_lead">New Lead</option>
          <option value="daily">Daily</option>
          <option value="follow_up_reminder">Follow-Up Reminder</option>
        </select>

        <input
          value={triggerValue}
          onChange={(e) => setTriggerValue(e.target.value)}
          placeholder="Optional trigger value (example: 9am or 3 days)"
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
        />

        <button
          onClick={createTrigger}
          disabled={!chainId || !name}
          className="rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
        >
          Create Trigger
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Optional trigger input..."
          className="h-28 w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
        />
      </div>

      <div className="mt-6 space-y-4">
        {triggers.length === 0 ? (
          <p className="text-zinc-500">
            No triggers yet.
          </p>
        ) : (
          triggers.map((trigger) => (
            <div
              key={trigger.id}
              className="rounded-2xl border border-zinc-800 bg-black p-5"
            >
              <h3 className="text-2xl font-black">
                {trigger.name}
              </h3>

              <p className="mt-2 text-zinc-400">
                Type: {trigger.trigger_type}
              </p>

              <p className="text-zinc-500">
                Value: {trigger.trigger_value || "none"}
              </p>

              <button
                onClick={() => runTrigger(trigger.id)}
                disabled={!!loading}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading === trigger.id ? "Running..." : "Run Trigger"}
              </button>
            </div>
          ))
        )}
      </div>

      {output && (
        <div className="mt-6 rounded-2xl border border-green-800 bg-green-950/30 p-5">
          <h3 className="mb-4 text-2xl font-black text-green-300">
            Trigger Output
          </h3>

          <pre className="whitespace-pre-wrap text-sm text-green-100">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}