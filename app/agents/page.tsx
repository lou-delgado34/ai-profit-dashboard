import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import CreateAgentForm from "./create-agent-form";
import AgentTriggerPanel from "./agent-trigger-panel";
import AgentDecisionPanel from "./agent-decision-panel";
import AgentChainPanel from "./agent-chain-panel";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AgentsPage() {
  const { data: agents } = await supabase.from("agents").select("*").order("created_at", { ascending: false });
  const { data: chains } = await supabase.from("agent_chains").select("*").order("created_at", { ascending: false });
  const { data: triggers } = await supabase.from("agent_triggers").select("*").order("created_at", { ascending: false });
  const { data: decisions } = await supabase.from("agent_decisions").select("*").order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur-xl">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI Software Factory
            </p>
            <p className="text-sm text-zinc-500">Superagent Workspace</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">Home</Link>
            <Link href="/projects" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">Projects</Link>
            <Link href="/agents" className="rounded-xl bg-green-600 px-5 py-2.5 font-bold">Agents</Link>
            <Link href="/actions" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">Actions</Link>
          </div>
        </nav>

        <section className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-green-400">
            AI Superagents
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Build Your Agent Team
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-zinc-400">
            Create agents, connect chains, set triggers, and review decisions from one clean workspace.
          </p>
        </section>

        <div className="space-y-10">
          <CreateAgentForm />
          <AgentTriggerPanel chains={chains || []} triggers={triggers || []} />
          <AgentDecisionPanel decisions={decisions || []} />
          <AgentChainPanel agents={agents || []} chains={chains || []} />
        </div>
      </div>
    </main>
  );
}