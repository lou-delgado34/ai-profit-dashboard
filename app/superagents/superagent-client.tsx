"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuperAgentClient({
  runs,
  agents,
  memories,
  outputs,
  tasks,
}: {
  runs: any[];
  agents: any[];
  memories: any[];
  outputs: any[];
  tasks: any[];
}) {
  const router = useRouter();

  const [goal, setGoal] = useState(
    "Build me a recruiting campaign for people interested in extra income using term life insurance education."
  );

  const [loading, setLoading] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);

  const [agentForm, setAgentForm] = useState({
    name: "",
    role: "",
    instructions: "",
    tools: "CRM, Email, Funnel, Marketing",
  });

  const [memoryForm, setMemoryForm] = useState({
    agentId: "",
    memoryTitle: "",
    memoryContent: "",
  });

  async function runSuperAgent() {
    if (!goal.trim()) {
      alert("Type a goal first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/run-superagent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "SuperAgent failed.");
      return;
    }

    router.refresh();
    alert("SuperAgent completed.");
  }

  async function createAgent() {
    if (!agentForm.name || !agentForm.role || !agentForm.instructions) {
      alert("Add name, role, and instructions.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-custom-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: agentForm.name,
        role: agentForm.role,
        instructions: agentForm.instructions,
        tools: agentForm.tools
          .split(",")
          .map((tool) => tool.trim())
          .filter(Boolean),
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not create agent.");
      return;
    }

    resetForm();
    router.refresh();
    alert("Agent created.");
  }

  async function updateAgent() {
    if (!editingAgent) return;

    if (!agentForm.name || !agentForm.role || !agentForm.instructions) {
      alert("Add name, role, and instructions.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/update-custom-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId: editingAgent.id,
        name: agentForm.name,
        role: agentForm.role,
        instructions: agentForm.instructions,
        tools: agentForm.tools
          .split(",")
          .map((tool) => tool.trim())
          .filter(Boolean),
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not update agent.");
      return;
    }

    resetForm();
    router.refresh();
    alert("Agent updated.");
  }

  async function deleteAgent(agent: any) {
    const isManager =
      agent.name?.toLowerCase() === "lou" ||
      agent.role?.toLowerCase().includes("manager");

    if (isManager) {
      alert("Manager agent cannot be deleted.");
      return;
    }

    const ok = confirm(`Delete ${agent.name}?`);

    if (!ok) return;

    setLoading(true);

    const res = await fetch("/api/delete-custom-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId: agent.id }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not delete agent.");
      return;
    }

    resetForm();
    router.refresh();
    alert("Agent deleted.");
  }

  async function createMemory() {
    if (!memoryForm.agentId || !memoryForm.memoryTitle || !memoryForm.memoryContent) {
      alert("Choose agent, add memory title, and memory content.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-agent-memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memoryForm),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not save memory.");
      return;
    }

    setMemoryForm({
      agentId: "",
      memoryTitle: "",
      memoryContent: "",
    });

    router.refresh();
    alert("Memory saved.");
  }

  async function deleteMemory(memoryId: string) {
    const ok = confirm("Delete this memory?");

    if (!ok) return;

    setLoading(true);

    const res = await fetch("/api/delete-agent-memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ memoryId }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not delete memory.");
      return;
    }

    router.refresh();
    alert("Memory deleted.");
  }

  function startEditing(agent: any) {
    setEditingAgent(agent);

    setAgentForm({
      name: agent.name || "",
      role: agent.role || "",
      instructions: agent.instructions || "",
      tools: (agent.tools || []).join(", "),
    });

    window.scrollTo({
      top: 350,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingAgent(null);

    setAgentForm({
      name: "",
      role: "",
      instructions: "",
      tools: "CRM, Email, Funnel, Marketing",
    });
  }

  function getAgentMemories(agentId: string) {
    return memories.filter((memory) => memory.agent_id === agentId);
  }

  function getAgentOutputs(agentName: string) {
    return outputs.filter(
      (output) =>
        output.agent_name?.toLowerCase() === agentName?.toLowerCase()
    );
  }

  function getAgentTasks(agentName: string) {
    return tasks.filter(
      (task) => task.agent_name?.toLowerCase() === agentName?.toLowerCase()
    );
  }

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">New SuperAgent Run</h2>

          <p className="mt-3 text-zinc-400">
            Tell your agent team what to build.
          </p>

          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-5 min-h-52 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none focus:border-purple-500"
          />

          <button
            onClick={runSuperAgent}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-purple-600 px-5 py-4 font-bold disabled:opacity-50"
          >
            {loading ? "Agents Working..." : "Run SuperAgent Team"}
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">
            {editingAgent ? "Edit Custom Agent" : "Create Custom Agent"}
          </h2>

          {editingAgent && (
            <p className="mt-2 text-sm font-bold text-orange-400">
              Editing: {editingAgent.name}
            </p>
          )}

          <input
            value={agentForm.name}
            onChange={(e) =>
              setAgentForm({ ...agentForm, name: e.target.value })
            }
            placeholder="Agent name. Example: Emma"
            className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <input
            value={agentForm.role}
            onChange={(e) =>
              setAgentForm({ ...agentForm, role: e.target.value })
            }
            placeholder="Role. Example: Email Marketer"
            className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <textarea
            value={agentForm.instructions}
            onChange={(e) =>
              setAgentForm({ ...agentForm, instructions: e.target.value })
            }
            placeholder="Instructions. Example: Write friendly follow-up emails that book appointments."
            className="mt-3 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <input
            value={agentForm.tools}
            onChange={(e) =>
              setAgentForm({ ...agentForm, tools: e.target.value })
            }
            placeholder="Tools separated by commas"
            className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              onClick={editingAgent ? updateAgent : createAgent}
              disabled={loading}
              className="rounded-2xl bg-green-600 px-5 py-4 font-bold disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingAgent
                ? "Update Agent"
                : "Save Custom Agent"}
            </button>

            <button
              onClick={resetForm}
              disabled={loading}
              className="rounded-2xl bg-zinc-800 px-5 py-4 font-bold disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Add Agent Memory</h2>

          <select
            value={memoryForm.agentId}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, agentId: e.target.value })
            }
            className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          >
            <option value="">Choose agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} — {agent.role}
              </option>
            ))}
          </select>

          <input
            value={memoryForm.memoryTitle}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, memoryTitle: e.target.value })
            }
            placeholder="Memory title. Example: Brand Voice"
            className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <textarea
            value={memoryForm.memoryContent}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, memoryContent: e.target.value })
            }
            placeholder="Memory content. Example: Always write for Team Avengers, term life, recruiting, English and Spanish."
            className="mt-3 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <button
            onClick={createMemory}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-orange-600 px-5 py-4 font-bold disabled:opacity-50"
          >
            {loading ? "Saving Memory..." : "Save Memory"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Agent Admin</h2>
          <p className="mt-2 text-zinc-400">
            Manage names, roles, instructions, memory, tasks, and outputs.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {agents.length === 0 ? (
              <p className="text-sm text-zinc-500">No custom agents yet.</p>
            ) : (
              agents.map((agent) => {
                const agentMemories = getAgentMemories(agent.id);
                const agentOutputs = getAgentOutputs(agent.name);
                const agentTasks = getAgentTasks(agent.name);

                const isManager =
                  agent.name?.toLowerCase() === "lou" ||
                  agent.role?.toLowerCase().includes("manager");

                return (
                  <div
                    key={agent.id}
                    className="rounded-3xl border border-zinc-800 bg-black p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black">{agent.name}</p>
                        <p className="mt-1 text-sm font-bold text-purple-300">
                          {agent.role}
                        </p>
                      </div>

                      {isManager && (
                        <span className="rounded-full bg-orange-950 px-3 py-1 text-xs font-bold text-orange-300">
                          Manager Locked
                        </span>
                      )}
                    </div>

                    <p className="mt-4 line-clamp-5 text-sm leading-6 text-zinc-400">
                      {agent.instructions}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(agent.tools || []).map((tool: string) => (
                        <span
                          key={tool}
                          className="rounded-full bg-purple-950 px-3 py-1 text-xs font-bold text-purple-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <MiniCount label="Memory" value={agentMemories.length} />
                      <MiniCount label="Tasks" value={agentTasks.length} />
                      <MiniCount label="Outputs" value={agentOutputs.length} />
                    </div>

                    <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-sm font-bold text-orange-300">
                        Memory
                      </p>

                      {agentMemories.length === 0 ? (
                        <p className="mt-2 text-sm text-zinc-500">
                          No saved memory.
                        </p>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {agentMemories.map((memory) => (
                            <div
                              key={memory.id}
                              className="rounded-xl border border-zinc-800 bg-black p-3"
                            >
                              <p className="font-bold text-orange-200">
                                {memory.memory_title}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-zinc-400">
                                {memory.memory_content}
                              </p>

                              <button
                                onClick={() => deleteMemory(memory.id)}
                                className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold"
                              >
                                Delete Memory
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 grid gap-2 md:grid-cols-2">
                      <button
                        onClick={() => startEditing(agent)}
                        className="rounded-xl bg-blue-600 px-4 py-3 font-bold"
                      >
                        Edit Agent
                      </button>

                      <button
                        onClick={() => deleteAgent(agent)}
                        className={`rounded-xl px-4 py-3 font-bold ${
                          isManager
                            ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                            : "bg-red-600"
                        }`}
                      >
                        Delete Agent
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Recent Runs</h2>

          <div className="mt-5 space-y-5">
            {runs.length === 0 ? (
              <div className="rounded-3xl border border-zinc-800 bg-black p-6 text-zinc-400">
                No SuperAgent runs yet.
              </div>
            ) : (
              runs.map((run) => (
                <div
                  key={run.id}
                  className="rounded-3xl border border-zinc-800 bg-black p-6"
                >
                  <p className="text-sm font-bold uppercase text-purple-400">
                    {new Date(run.created_at).toLocaleString()}
                  </p>

                  <h3 className="mt-2 text-2xl font-black">{run.user_goal}</h3>

                  <pre className="mt-5 max-h-[500px] overflow-auto whitespace-pre-wrap rounded-2xl bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
                    {run.final_output}
                  </pre>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

function MiniCount({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-zinc-500">{label}</p>
    </div>
  );
}