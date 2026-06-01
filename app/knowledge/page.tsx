import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import KnowledgeClient from "./knowledge-client";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function KnowledgePage() {
  const { data: knowledge } = await supabase
    .from("knowledge_base")
    .select("*")
    .order("created_at", { ascending: false });

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

          <Link href="/agent-chat" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            Agent Chat
          </Link>

          <Link href="/knowledge" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
            Knowledge Base
          </Link>
        </nav>

        <section className="rounded-3xl border border-orange-800 bg-orange-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-300">
            Team Avengers Knowledge Base
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Agent Training Library
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            Save scripts, training notes, recruiting materials, term life education, and Spanish scripts for your agents to use.
          </p>
        </section>

        <KnowledgeClient knowledge={knowledge || []} />
      </div>
    </main>
  );
}