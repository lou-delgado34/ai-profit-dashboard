"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function AgentChatClient({
  agents,
  chats,
}: {
  agents: any[];
  chats: any[];
}) {
  const router = useRouter();

  const [agentId, setAgentId] = useState(agents[0]?.id || "");
  const [message, setMessage] = useState(
    "Create 3 recruiting post ideas for licensed life insurance agents."
  );
  const [loading, setLoading] = useState(false);
  const [lastReply, setLastReply] = useState("");

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === agentId),
    [agents, agentId]
  );

  const selectedChats = chats.filter((chat) => chat.agent_id === agentId);

  async function sendMessage() {
    if (!agentId) {
      alert("Choose an agent.");
      return;
    }

    if (!message.trim()) {
      alert("Type a message.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/chat-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId,
        message,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Chat failed.");
      return;
    }

    setLastReply(data.reply || "");
    setMessage("");
    router.refresh();
  }

  function copyReply() {
    if (!lastReply) {
      alert("No reply to copy yet.");
      return;
    }

    navigator.clipboard.writeText(lastReply);
    alert("Reply copied.");
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-3xl font-black">Choose Agent</h2>

        <select
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        >
          {agents.length === 0 ? (
            <option value="">No active agents</option>
          ) : (
            agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} — {agent.role}
              </option>
            ))
          )}
        </select>

        {selectedAgent && (
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
            <p className="text-xl font-black">{selectedAgent.name}</p>
            <p className="mt-1 text-sm font-bold text-green-300">
              {selectedAgent.role}
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {selectedAgent.instructions}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(selectedAgent.tools || []).map((tool: string) => (
                <span
                  key={tool}
                  className="rounded-full bg-green-950 px-3 py-1 text-xs font-bold text-green-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Message Agent</h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-5 min-h-40 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none focus:border-green-500"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-2xl bg-green-600 px-6 py-4 font-bold disabled:opacity-50"
            >
              {loading ? "Agent Thinking..." : "Send Message"}
            </button>

            <button
              onClick={copyReply}
              className="rounded-2xl bg-blue-600 px-6 py-4 font-bold"
            >
              Copy Last Reply
            </button>
          </div>
        </div>

        {lastReply && (
          <div className="rounded-3xl border border-green-800 bg-green-950/20 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-green-300">
              Latest Reply
            </p>

            <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-black p-5 text-sm leading-7 text-zinc-300">
              {lastReply}
            </pre>
          </div>
        )}

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Recent Chat History</h2>

          <div className="mt-5 space-y-4">
            {selectedChats.length === 0 ? (
              <p className="text-zinc-500">No chat history for this agent yet.</p>
            ) : (
              selectedChats.map((chat) => (
                <div
                  key={chat.id}
                  className="rounded-2xl border border-zinc-800 bg-black p-5"
                >
                  <p className="text-sm font-bold uppercase text-green-300">
                    {chat.agent_name} • {new Date(chat.created_at).toLocaleString()}
                  </p>

                  <p className="mt-4 font-bold text-white">You:</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {chat.user_message}
                  </p>

                  <p className="mt-4 font-bold text-white">{chat.agent_name}:</p>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                    {chat.agent_response}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}