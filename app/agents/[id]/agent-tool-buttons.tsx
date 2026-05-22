"use client";

import { useState } from "react";

export default function AgentToolButtons({
  agentId,
}: {
  agentId: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loadingTool, setLoadingTool] = useState("");

  const runTool = async (tool: string) => {
    setLoadingTool(tool);
    setOutput("");

    const response = await fetch("/api/run-agent-tool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId,
        tool,
        input,
      }),
    });

    const data = await response.json();

    if (data.output) {
      setOutput(data.output);
    } else {
      setOutput("Tool failed. Please try again.");
    }

    setLoadingTool("");
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    alert("Copied!");
  };

  const tools = [
    {
      key: "dm_writer",
      label: "Write DM",
    },
    {
      key: "follow_up_writer",
      label: "Follow-Up",
    },
    {
      key: "objection_handler",
      label: "Handle Objection",
    },
    {
      key: "appointment_script",
      label: "Appointment Script",
    },
    {
      key: "recruiting_script",
      label: "Recruiting Message",
    },
    {
      key: "content_post",
      label: "Content Post",
    },
  ];

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-2xl font-black">
        Agent Tools
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Optional: Add context here. Example: They said they are interested but want to think about it."
        className="mb-4 h-28 w-full rounded-2xl border border-zinc-700 bg-black p-4 text-white"
      />

      <div className="grid gap-3 md:grid-cols-2">
        {tools.map((tool) => (
          <button
            key={tool.key}
            onClick={() => runTool(tool.key)}
            disabled={!!loadingTool}
            className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {loadingTool === tool.key ? "Running..." : tool.label}
          </button>
        ))}
      </div>

      {output && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-black p-5">
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-black">Tool Output</h3>

            <button
              onClick={copyOutput}
              className="rounded-xl bg-blue-600 px-4 py-2 font-bold hover:bg-blue-700"
            >
              Copy Output
            </button>
          </div>

          <pre className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}