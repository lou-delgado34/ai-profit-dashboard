import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import CreateAgentForm from "./create-agent-form";
import AgentChainPanel from "./agent-chain-panel";
import AgentTriggerPanel from "./agent-trigger-panel";
import AgentDecisionPanel from "./agent-decision-panel";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AgentsPage() {
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: chains } = await supabase
    .from("agent_chains")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: triggers } = await supabase
    .from("agent_triggers")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: decisions } = await supabase
    .from("agent_decisions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-400">
              Superagent Team System
            </p>

            <h1 className="mt-2 text-5xl font-black">
              AI Superagents
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Create agents, chain them together, trigger workflows, and let the
              decision brain choose the best next move.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
            >
              App Builder
            </Link>

            <Link
              href="/projects"
              className="rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-700"
            >
              Projects
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">
              Agents
            </p>
            <p className="mt-2 text-4xl font-black">
              {agents?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">
              Chains
            </p>
            <p className="mt-2 text-4xl font-black">
              {chains?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">
              Triggers
            </p>
            <p className="mt-2 text-4xl font-black">
              {triggers?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">
              Progress
            </p>
            <p className="mt-2 text-4xl font-black">
              90%
            </p>
          </div>
        </div>

        <AgentDecisionPanel decisions={decisions || []} />

        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <CreateAgentForm />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {(agents || []).map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="block rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-green-500"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    {agent.name}
                  </h2>

                  <p className="mt-2 text-zinc-400">
                    {agent.role}
                  </p>
                </div>

                <span className="rounded-full border border-zinc-700 bg-black px-3 py-1 text-xs font-bold uppercase text-zinc-300">
                  {agent.status || "draft"}
                </span>
              </div>

              <p className="mt-4 line-clamp-3 text-sm text-zinc-300">
                {agent.instructions}
              </p>
            </Link>
          ))}
        </div>

        <AgentChainPanel
          agents={agents || []}
          chains={chains || []}
        />

        <AgentTriggerPanel
          chains={chains || []}
          triggers={triggers || []}
        />
      </div>
    </main>
  );
}