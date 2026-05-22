"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentWorkflowsPanel({
  agentId,
  workflows,
}: {
  agentId: string;
  workflows: any[];
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState("");

  const createWorkflow = async () => {
    await fetch("/api/create-agent-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId, name, description, steps }),
    });

    setName("");
    setDescription("");
    setSteps("");
    router.refresh();
  };

  const runWorkflow = async (workflowId: string) => {
    setLoading(workflowId);
    setOutput("");

    const response = await fetch("/api/run-agent-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workflowId, input }),
    });

    const data = await response.json();

    setOutput(data.output || "Workflow failed.");
    setLoading("");
    router.refresh();
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-2xl font-black">Workflows</h2>

      <div className="rounded-2xl border border-zinc-800 bg-black p-4">
        <h3 className="mb-3 text-xl font-black">Create Workflow</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workflow name..."
          className="mb-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Workflow description..."
          className="mb-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        />

        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Step 1: Review the lead&#10;Step 2: Write follow-up&#10;Step 3: Create appointment script&#10;Step 4: Give next action"
          className="h-40 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        />

        <button
          onClick={createWorkflow}
          disabled={!name || !steps}
          className="mt-3 rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
        >
          Create Workflow
        </button>
      </div>

      <div className="mt-5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Optional workflow input. Example: Lead said they are interested but need to talk to spouse."
          className="h-28 w-full rounded-xl border border-zinc-700 bg-black p-3 text-white"
        />
      </div>

      <div className="mt-5 space-y-3">
        {workflows.length === 0 ? (
          <p className="text-zinc-500">No workflows yet.</p>
        ) : (
          workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="rounded-2xl border border-zinc-800 bg-black p-4"
            >
              <h3 className="text-xl font-black">{workflow.name}</h3>

              <p className="mt-2 text-sm text-zinc-400">
                {workflow.description}
              </p>

              <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-zinc-950 p-3 text-sm text-zinc-300">
                {workflow.steps}
              </pre>

              <button
                onClick={() => runWorkflow(workflow.id)}
                disabled={!!loading}
                className="mt-3 rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading === workflow.id ? "Running..." : "Run Workflow"}
              </button>
            </div>
          ))
        )}
      </div>

      {output && (
        <div className="mt-5 rounded-2xl border border-green-800 bg-green-950/30 p-4">
          <h3 className="mb-3 text-xl font-black text-green-300">
            Workflow Output
          </h3>

          <pre className="whitespace-pre-wrap text-sm leading-6 text-green-100">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}