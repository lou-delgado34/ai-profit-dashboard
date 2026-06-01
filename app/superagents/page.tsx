import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SuperAgentClient from "./superagent-client";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function SuperAgentsPage() {
  const { data: runs } = await supabase
    .from("superagent_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: agents } = await supabase
    .from("custom_agents")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: memories } = await supabase
    .from("agent_memories")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: outputs } = await supabase
    .from("agent_tool_outputs")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: tasks } = await supabase
    .from("agent_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
            Home
          </Link>

          <Link href="/crm" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
            CRM
          </Link>

          <Link href="/superagents" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
            SuperAgents
          </Link>

          <Link href="/campaigns" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
            Campaigns
          </Link>

          <Link href="/tasks" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            Agent Tasks
          </Link>
        </nav>

        <section className="rounded-3xl border border-purple-800 bg-purple-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-300">
            SuperAgent Admin Center
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Manage Your Agent Team
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            Create, edit, delete, manage memory, and track each agent’s tasks and outputs.
          </p>
        </section>

        <SuperAgentClient
          runs={runs || []}
          agents={agents || []}
          memories={memories || []}
          outputs={outputs || []}
          tasks={tasks || []}
        />
      </div>
    </main>
  );
}