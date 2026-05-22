"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentChainPanel({
  agents,
  chains,
}: {
  agents: any[];
  chains: any[];
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainAgentId, setMainAgentId] = useState("");
  const [helperAgentId, setHelperAgentId] = useState("");
  const [chainGoal, setChainGoal] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState("");

  const createChain = async () => {
    await fetch("/api/create-agent-chain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        mainAgentId,
        helperAgentId,
        chainGoal,
      }),
    });

    setName("");
    setDescription("");
    setMainAgentId("");
    setHelperAgentId("");
    setChainGoal("");

    router.refresh();
  };

  const runChain = async (chainId: string) => {
    setLoading(chainId);
    setOutput("");

    const response = await fetch("/api/run-agent-chain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chainId,
        input,
      }),
    });

    const data = await response.json();

    setOutput(data.output || "Chain failed.");
    setLoading("");

    router.refresh();
  };

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="mb-4 text-3xl font-black">
        Multi-Agent Chains
      </h2>

      <p className="mb-6 text-zinc-400">
        Connect two agents together so one agent helps another complete a task.
      </p>

      <div className="rounded-2xl border border-zinc-800 bg-black p-5">
        <h3 className="mb-4 text-2xl font-black">
          Create Agent Chain
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chain name..."
            className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
          />

          <select
            value={mainAgentId}
            onChange={(e) => setMainAgentId(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
          >
            <option value="">Select main agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>

          <select
            value={helperAgentId}
            onChange={(e) => setHelperAgentId(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
          >
            <option value="">Select helper agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={chainGoal}
          onChange={(e) => setChainGoal(e.target.value)}
          placeholder="What should these agents complete together?"
          className="mt-4 h-32 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
        />

        <button
          onClick={createChain}
          disabled={!name || !mainAgentId || !helperAgentId || !chainGoal}
          className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
        >
          Create Chain
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Optional input. Example: Lead said they want term life but need to talk to spouse first."
          className="h-28 w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
        />
      </div>

      <div className="mt-6 space-y-4">
        {chains.length === 0 ? (
          <p className="text-zinc-500">
            No chains yet.
          </p>
        ) : (
          chains.map((chain) => (
            <div
              key={chain.id}
              className="rounded-2xl border border-zinc-800 bg-black p-5"
            >
              <h3 className="text-2xl font-black">
                {chain.name}
              </h3>

              <p className="mt-2 text-zinc-400">
                {chain.description}
              </p>

              <p className="mt-4 text-sm text-zinc-300">
                <strong>Goal:</strong> {chain.chain_goal}
              </p>

              <button
                onClick={() => runChain(chain.id)}
                disabled={!!loading}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading === chain.id ? "Running Chain..." : "Run Chain"}
              </button>
            </div>
          ))
        )}
      </div>

      {output && (
        <div className="mt-6 rounded-2xl border border-green-800 bg-green-950/30 p-5">
          <h3 className="mb-4 text-2xl font-black text-green-300">
            Chain Output
          </h3>

          <pre className="whitespace-pre-wrap text-sm leading-6 text-green-100">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}