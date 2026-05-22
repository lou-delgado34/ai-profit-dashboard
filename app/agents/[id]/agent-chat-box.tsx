"use client";

import { useState } from "react";

export default function AgentChatBox({
  agentId,
  startingMessages,
}: {
  agentId: string;
  startingMessages: { role: string; content: string }[];
}) {
  const [messages, setMessages] = useState(startingMessages || []);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setLoading(true);

    const response = await fetch("/api/chat-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId,
        message: userMessage.content,
      }),
    });

    const data = await response.json();

    if (data.reply) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-2xl font-black">
        Test Agent Chat
      </h2>

      <div className="mb-4 max-h-[500px] overflow-auto rounded-2xl border border-zinc-800 bg-black p-4">
        {messages.length === 0 ? (
          <p className="text-zinc-500">
            Start a conversation with this Superagent.
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 ${
                  msg.role === "assistant"
                    ? "bg-zinc-900"
                    : "bg-blue-950"
                }`}
              >
                <p className="mb-2 text-xs font-bold uppercase text-zinc-500">
                  {msg.role === "assistant" ? "Agent" : "You"}
                </p>

                <p className="whitespace-pre-wrap text-zinc-200">
                  {msg.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="rounded-2xl bg-zinc-900 p-4 text-zinc-400">
                Agent is thinking...
              </div>
            )}
          </div>
        )}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask this agent to help you..."
        className="h-32 w-full rounded-2xl border border-zinc-700 bg-black p-4 text-white"
      />

      <button
        onClick={sendMessage}
        disabled={loading || !message.trim()}
        className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Send Message"}
      </button>
    </div>
  );
}