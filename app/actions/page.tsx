import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import ActionButtons from "./action-buttons";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ActionsPage() {
  const { data: actions } = await supabase
    .from("agent_actions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 font-bold">Home</Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-6 py-3 font-bold">Projects</Link>
          <Link href="/agents" className="rounded-xl bg-green-600 px-6 py-3 font-bold">Agents</Link>
          <Link href="/actions" className="rounded-xl bg-pink-600 px-6 py-3 font-bold">Actions</Link>
        </div>

        <h1 className="text-6xl font-black mb-4">Action Queue</h1>
        <p className="mb-10 text-zinc-400 text-xl">
          Review, copy, open, approve, complete, or reject Superagent actions.
        </p>

        <div className="space-y-6">
          {(actions || []).map((action: any) => (
            <div key={action.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-green-400">
                {action.action_type}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {action.title || "Untitled Action"}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                {action.created_at ? new Date(action.created_at).toLocaleString() : ""}
              </p>

              <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-black p-5 text-sm text-zinc-300">
                {action.content}
              </pre>

              <ActionButtons
                id={action.id}
                actionType={action.action_type}
                content={action.content || ""}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}