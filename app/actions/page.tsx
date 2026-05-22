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
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
            App Builder
          </Link>
          <Link href="/agents" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            Agents
          </Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
            Projects
          </Link>
        </div>

        <p className="text-sm font-bold uppercase tracking-widest text-green-400">
          Superagent Control Center
        </p>

        <h1 className="mt-2 text-5xl font-black">Action Queue</h1>

        <div className="mt-8 space-y-6">
          {(actions || []).map((action: any) => (
            <div key={action.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-green-400">
                    {action.action_type}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">{action.title}</h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    {new Date(action.created_at).toLocaleString()}
                  </p>
                </div>

                <span className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold uppercase">
                  {action.status || "pending"}
                </span>
              </div>

              <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-black p-4 text-sm text-zinc-300">
                {action.content}
              </pre>

              <ActionButtons
                id={action.id}
                actionType={action.action_type}
                content={action.content}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}