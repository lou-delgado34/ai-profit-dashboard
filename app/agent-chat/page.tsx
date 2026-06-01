import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AgentChatClient from "./agent-chat-client";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AgentChatPage() {
  const { data: agents } = await supabase
    .from("custom_agents")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  const { data: chats } = await supabase
    .from("agent_chats")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
            Home
          </Link>

          <Link href="/superagents" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
            SuperAgents
          </Link>

          <Link href="/campaigns" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
            Campaigns
          </Link>

          <Link href="/agent-chat" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            Agent Chat
          </Link>
        </nav>

        <section className="rounded-3xl border border-green-800 bg-green-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-green-300">
            Live Agent Chat
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Chat With Your Agents
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            Ask one saved agent a question and get a role-specific answer using that agent’s instructions and memory.
          </p>
        </section>

        <AgentChatClient agents={agents || []} chats={chats || []} />
      </div>
    </main>
  );
}