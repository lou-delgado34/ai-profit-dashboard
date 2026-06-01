import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function TasksPage() {
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

        <section className="rounded-3xl border border-green-800 bg-green-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-green-300">
            Delegation Center
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Agent Tasks
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            Every delegated task your manager agent assigns to your custom agents.
          </p>
        </section>

        <section className="mt-8 space-y-5">
          {!tasks || tasks.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
              No delegated tasks yet.
            </div>
          ) : (
            tasks.map((task: any) => (
              <div
                key={task.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase text-green-400">
                      {task.agent_name} • {task.agent_role}
                    </p>

                    <h2 className="mt-2 text-3xl font-black">
                      {task.task_title}
                    </h2>

                    <p className="mt-3 leading-7 text-zinc-400">
                      {task.task_description}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-950 px-4 py-2 text-sm font-bold text-green-300">
                    {task.status}
                  </span>
                </div>

                <pre className="mt-5 max-h-[500px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black p-5 text-sm leading-7 text-zinc-300">
                  {task.output}
                </pre>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}