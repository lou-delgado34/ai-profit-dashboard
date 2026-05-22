import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AgentsPage() {
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
            App Builder
          </Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
            Projects
          </Link>
          <Link href="/actions" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            Action Queue
          </Link>
        </div>

        <p className="text-sm font-bold uppercase tracking-widest text-green-400">
          Superagent Team System
        </p>

        <h1 className="mt-2 text-5xl font-black">AI Superagents</h1>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {(agents || []).map((agent: any) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-green-500"
            >
              <h2 className="text-2xl font-black">{agent.name}</h2>
              <p className="mt-2 text-zinc-400">{agent.role}</p>
              <p className="mt-4 text-sm text-zinc-500">{agent.status || "draft"}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}