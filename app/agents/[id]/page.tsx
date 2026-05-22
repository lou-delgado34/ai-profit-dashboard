import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AgentStatusSelect from "./agent-status-select";
import AgentChatBox from "./agent-chat-box";
import AgentToolButtons from "./agent-tool-buttons";
import AgentMemoryPanel from "./agent-memory-panel";
import AgentWorkflowsPanel from "./agent-workflows-panel";
import GmailDraftPanel from "./gmail-draft-panel";
import WhatsAppDraftPanel from "./whatsapp-draft-panel";
import SmsDraftPanel from "./sms-draft-panel";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: agent, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  const { data: messages } = await supabase
    .from("agent_messages")
    .select("role, content")
    .eq("agent_id", id)
    .order("created_at", { ascending: true });

  const { data: memories } = await supabase
    .from("agent_memory")
    .select("*")
    .eq("agent_id", id)
    .order("created_at", { ascending: false });

  const { data: workflows } = await supabase
    .from("agent_workflows")
    .select("*")
    .eq("agent_id", id)
    .order("created_at", { ascending: false });

  if (error || !agent) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-black">Agent not found</h1>

          <Link
            href="/agents"
            className="mt-6 inline-block rounded-xl bg-green-600 px-5 py-3 font-bold"
          >
            Back to Agents
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/agents"
            className="rounded-xl bg-zinc-800 px-5 py-3 font-bold hover:bg-zinc-700"
          >
            ← Agents
          </Link>

          <Link
            href="/actions"
            className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
          >
            Action Queue
          </Link>

          <Link
            href="/projects"
            className="rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-700"
          >
            Projects
          </Link>
        </div>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-green-400">
            Superagent Workspace
          </p>

          <h1 className="mt-2 text-5xl font-black">{agent.name}</h1>

          <p className="mt-3 text-xl text-zinc-300">{agent.role}</p>

          <p className="mt-3 text-sm text-zinc-500">
            Created: {new Date(agent.created_at).toLocaleString()}
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <h2 className="mb-4 text-2xl font-black">Agent Settings</h2>

              <AgentStatusSelect id={agent.id} currentStatus={agent.status} />

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-black p-4">
                <p className="text-sm font-bold uppercase text-zinc-500">
                  Trigger Type
                </p>
                <p className="mt-2 text-lg font-bold">
                  {agent.trigger_type || "manual"}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <h2 className="mb-4 text-2xl font-black">Agent Instructions</h2>

              <pre className="whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
                {agent.instructions}
              </pre>
            </section>

            <AgentMemoryPanel agentId={agent.id} memories={memories || []} />
          </aside>

          <section className="space-y-6">
            <GmailDraftPanel agentId={agent.id} />

            <WhatsAppDraftPanel agentId={agent.id} />

            <SmsDraftPanel agentId={agent.id} />

            <AgentWorkflowsPanel
              agentId={agent.id}
              workflows={workflows || []}
            />

            <AgentToolButtons agentId={agent.id} />

            <AgentChatBox
              agentId={agent.id}
              startingMessages={messages || []}
            />
          </section>
        </div>
      </div>
    </main>
  );
}