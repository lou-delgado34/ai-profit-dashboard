"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAgentForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [instructions, setInstructions] = useState("");
  const [triggerType, setTriggerType] = useState("manual");
  const [tools, setTools] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTool = (tool: string) => {
    if (tools.includes(tool)) {
      setTools(tools.filter((t) => t !== tool));
    } else {
      setTools([...tools, tool]);
    }
  };

  const createAgent = async () => {
    setLoading(true);

    const response = await fetch("/api/create-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        role,
        instructions,
        trigger_type: triggerType,
        tools,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (data.agentId) {
      router.push(`/agents/${data.agentId}`);
      router.refresh();
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-black">
        Create New Superagent
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Agent name..."
          className="rounded-xl border border-zinc-700 bg-black p-4 text-white"
        />

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Agent role..."
          className="rounded-xl border border-zinc-700 bg-black p-4 text-white"
        />
      </div>

      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="What should this agent do?"
        className="mt-4 h-40 w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
      />

      <div className="mt-4">
        <label className="mb-2 block font-bold">
          Trigger Type
        </label>

        <select
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-black p-4 text-white"
        >
          <option value="manual">Manual</option>
          <option value="scheduled">Scheduled</option>
          <option value="webhook">Webhook</option>
          <option value="event">Event Based</option>
        </select>
      </div>

      <div className="mt-4">
        <p className="mb-3 font-bold">Tools</p>

        <div className="flex flex-wrap gap-3">
          {[
            "content_generator",
            "dm_writer",
            "appointment_script",
            "recruiting_script",
            "follow_up_writer",
            "lead_scorer",
          ].map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => toggleTool(tool)}
              className={`rounded-xl px-4 py-3 font-bold ${
                tools.includes(tool)
                  ? "bg-green-600"
                  : "bg-zinc-800"
              }`}
            >
              {tool.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={createAgent}
        disabled={loading || !name || !role || !instructions}
        className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Superagent"}
      </button>
    </div>
  );
}