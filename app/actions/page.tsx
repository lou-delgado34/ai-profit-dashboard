import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ActionButtons from "./action-buttons";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full border border-zinc-700 bg-black px-4 py-2 text-sm font-bold uppercase text-zinc-300">
      {status}
    </span>
  );
}

function ActionCard({ action }: { action: any }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-green-400">
            {action.action_type}
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {action.title}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {new Date(action.created_at).toLocaleString()}
          </p>
        </div>

        <StatusBadge status={action.status || "pending"} />
      </div>

      <pre className="mt-5 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-black p-4 text-sm leading-6 text-zinc-300">
        {action.content}
      </pre>

      <ActionButtons
        id={action.id}
        actionType={action.action_type}
        content={action.content}
      />
    </div>
  );
}

export default async function ActionsPage() {
  const { data: actions } = await supabase
    .from("agent_actions")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: googleTokens } = await supabase
    .from("google_tokens")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  const gmailConnected = !!googleTokens?.length;

  const allActions = actions || [];

  const pending = allActions.filter((a) => a.status === "pending");
  const approved = allActions.filter((a) => a.status === "approved");

  const sent = allActions.filter(
    (a) =>
      a.status === "whatsapp_sent" ||
      a.status === "sms_sent" ||
      a.status === "gmail_draft_created"
  );

  const completed = allActions.filter(
    (a) => a.status === "completed" || a.status === "calendar_booking"
  );

  const rejected = allActions.filter((a) => a.status === "rejected");

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-400">
              Superagent Control Center
            </p>

            <h1 className="mt-2 text-5xl font-black">
              Action Queue
            </h1>

            <p className="mt-3 text-zinc-400">
              Review, approve, send, complete, copy, or reject Superagent actions.
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Google: {gmailConnected ? "Connected" : "Not connected"} •
              Twilio: Ready if env keys are added
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/api/google/connect"
              className="rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-700"
            >
              {gmailConnected ? "Reconnect Google" : "Connect Google"}
            </Link>

            <Link
              href="/agents"
              className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
            >
              Agents
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
            >
              App Builder
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">All</p>
            <p className="mt-2 text-4xl font-black">{allActions.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Pending</p>
            <p className="mt-2 text-4xl font-black">{pending.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Approved</p>
            <p className="mt-2 text-4xl font-black">{approved.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Sent</p>
            <p className="mt-2 text-4xl font-black">{sent.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Completed</p>
            <p className="mt-2 text-4xl font-black">{completed.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm font-bold uppercase text-zinc-500">Rejected</p>
            <p className="mt-2 text-4xl font-black">{rejected.length}</p>
          </div>
        </div>

        {allActions.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-black">No actions yet</h2>
            <p className="mt-2 text-zinc-400">
              Agent actions will appear here when Gmail, Calendar, WhatsApp,
              SMS, or workflows create tasks.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {pending.length > 0 && (
              <section>
                <h2 className="mb-4 text-3xl font-black">Pending</h2>
                <div className="grid gap-5">
                  {pending.map((action) => (
                    <ActionCard key={action.id} action={action} />
                  ))}
                </div>
              </section>
            )}

            {approved.length > 0 && (
              <section>
                <h2 className="mb-4 text-3xl font-black">Approved</h2>
                <div className="grid gap-5">
                  {approved.map((action) => (
                    <ActionCard key={action.id} action={action} />
                  ))}
                </div>
              </section>
            )}

            {sent.length > 0 && (
              <section>
                <h2 className="mb-4 text-3xl font-black">Sent</h2>
                <div className="grid gap-5">
                  {sent.map((action) => (
                    <ActionCard key={action.id} action={action} />
                  ))}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <h2 className="mb-4 text-3xl font-black">Completed</h2>
                <div className="grid gap-5">
                  {completed.map((action) => (
                    <ActionCard key={action.id} action={action} />
                  ))}
                </div>
              </section>
            )}

            {rejected.length > 0 && (
              <section>
                <h2 className="mb-4 text-3xl font-black">Rejected</h2>
                <div className="grid gap-5">
                  {rejected.map((action) => (
                    <ActionCard key={action.id} action={action} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}