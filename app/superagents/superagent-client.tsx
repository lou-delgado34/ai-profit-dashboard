"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const roleTemplates = [
  {
    name: "Designer",
    role: "Designer",
    tools: "Design, Social Media, Image Prompts, Flyers",
    instructions:
      "Create clean, premium, high-converting design concepts for social media, flyers, lead magnets, landing pages, and recruiting graphics. Include headline, layout, image idea, and CTA placement.",
  },
  {
    name: "Copywriter",
    role: "Copywriter",
    tools: "Copywriting, Ads, Captions, Hooks",
    instructions:
      "Write simple, emotional, compliant copy at a 6th-grade reading level. Create hooks, captions, CTAs, ads, and recruiting messages. Focus on term life, family protection, financial education, and recruiting without making guarantees.",
  },
  {
    name: "Email Marketer",
    role: "Email Marketer",
    tools: "Email, Follow-Up, Nurture Campaigns",
    instructions:
      "Create friendly email sequences, appointment booking emails, follow-ups, reminders, and recruiting nurture campaigns. Keep tone warm, simple, compliant, and action-focused.",
  },
  {
    name: "Funnel Builder",
    role: "Funnel Builder",
    tools: "Funnels, Landing Pages, Forms, CTA",
    instructions:
      "Build simple funnel plans with headline, offer, page structure, form fields, thank-you page, CTA, follow-up steps, and CRM workflow. Focus on generating appointments and recruiting conversations.",
  },
  {
    name: "Press Release Writer",
    role: "Press Release Writer",
    tools: "PR, Announcements, Media",
    instructions:
      "Write professional press releases, announcements, media blurbs, event promotions, and public-facing business updates for Team Avengers. Keep wording professional, clear, and compliant.",
  },
  {
    name: "Manager Agent",
    role: "Manager Agent",
    tools: "Delegation, Planning, Review, Strategy",
    instructions:
      "Act as the manager of the agent team. Break goals into tasks, assign work to the right agents, review outputs, and combine everything into a final business package.",
  },
];

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
    "Build me a recruiting campaign for licensed life insurance agents who want extra income."
  );

  const [loading, setLoading] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);

  const [agentForm, setAgentForm] = useState({
    name: "",
    role: "",
    instructions: "",
    tools: "CRM, Email, Funnel, Marketing",
    status: "active",
  });

  const [memoryForm, setMemoryForm] = useState({
    agentId: "",
    memoryTitle: "",
    memoryContent: "",
  });

  function applyTemplate(template: any) {
    setAgentForm({
      name: agentForm.name || template.name,
      role: template.role,
      instructions: template.instructions,
      tools: template.tools,
      status: "active",
    });
  }

  async function runSuperAgent() {
    if (!goal.trim()) {
      alert("Type a goal first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/run-superagent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: agentForm.name,
        role: agentForm.role,
        instructions: agentForm.instructions,
        tools: agentForm.tools.split(",").map((tool) => tool.trim()).filter(Boolean),
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: editingAgent.id,
        name: agentForm.name,
        role: agentForm.role,
        instructions: agentForm.instructions,
        tools: agentForm.tools.split(",").map((tool) => tool.trim()).filter(Boolean),
        status: agentForm.status,
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memoryForm),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not save memory.");
      return;
    }

    setMemoryForm({ agentId: "", memoryTitle: "", memoryContent: "" });
    router.refresh();
    alert("Memory saved.");
  }

  async function deleteMemory(memoryId: string) {
    const ok = confirm("Delete this memory?");
    if (!ok) return;

    setLoading(true);

    const res = await fetch("/api/delete-agent-memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      status: agent.status || "active",
    });

    window.scrollTo({ top: 350, behavior: "smooth" });
  }

  function resetForm() {
    setEditingAgent(null);
    setAgentForm({
      name: "",
      role: "",
      instructions: "",
      tools: "CRM, Email, Funnel, Marketing",
      status: "active",
    });
  }

  function getAgentMemories(agentId: string) {
    return memories.filter((memory) => memory.agent_id === agentId);
  }

  function getAgentOutputs(agentName: string) {
    return outputs.filter(
      (output) => output.agent_name?.toLowerCase() === agentName?.toLowerCase()
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
          <h2 className="text-3xl font-black">Role Templates</h2>

          <div className="mt-4 grid gap-2">
            {roleTemplates.map((template) => (
              <button
                key={template.role}
                onClick={() => applyTemplate(template)}
                className="rounded-xl bg-black px-4 py-3 text-left font-bold hover:bg-zinc-900"
              >
                {template.role}
              </button>
            ))}
          </div>
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
            onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
            placeholder="Agent name"
            className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <input
            value={agentForm.role}
            onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
            placeholder="Role"
            className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <textarea
            value={agentForm.instructions}
            onChange={(e) =>
              setAgentForm({ ...agentForm, instructions: e.target.value })
            }
            placeholder="Instructions"
            className="mt-3 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <input
            value={agentForm.tools}
            onChange={(e) => setAgentForm({ ...agentForm, tools: e.target.value })}
            placeholder="Tools separated by commas"
            className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <select
            value={agentForm.status}
            onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value })}
            className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              onClick={editingAgent ? updateAgent : createAgent}
              disabled={loading}
              className="rounded-2xl bg-green-600 px-5 py-4 font-bold disabled:opacity-50"
            >
              {editingAgent ? "Update Agent" : "Save Custom Agent"}
            </button>

            <button
              onClick={resetForm}
              disabled={loading}
              className="rounded-2xl bg-zinc-800 px-5 py-4 font-bold"
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
            placeholder="Memory title"
            className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <textarea
            value={memoryForm.memoryContent}
            onChange={(e) =>
              setMemoryForm({ ...memoryForm, memoryContent: e.target.value })
            }
            placeholder="Memory content"
            className="mt-3 min-h-32 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
          />

          <button
            onClick={createMemory}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-orange-600 px-5 py-4 font-bold disabled:opacity-50"
          >
            Save Memory
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Agent Admin</h2>

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
                    className={`rounded-3xl border p-5 ${
                      agent.status === "inactive"
                        ? "border-zinc-900 bg-zinc-950 opacity-60"
                        : "border-zinc-800 bg-black"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black">{agent.name}</p>
                        <p className="mt-1 text-sm font-bold text-purple-300">
                          {agent.role}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          agent.status === "inactive"
                            ? "bg-zinc-800 text-zinc-400"
                            : "bg-green-950 text-green-300"
                        }`}
                      >
                        {agent.status || "active"}
                      </span>
                    </div>

                    {isManager && (
                      <p className="mt-3 rounded-xl bg-orange-950 p-3 text-sm font-bold text-orange-300">
                        Manager Protected
                      </p>
                    )}

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
                <div key={run.id} className="rounded-3xl border border-zinc-800 bg-black p-6">
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