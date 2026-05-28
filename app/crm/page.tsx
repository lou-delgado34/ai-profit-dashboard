import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import CrmLeadForm from "./crm-lead-form";
import CrmLeadActions from "./crm-lead-actions";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CrmPage() {
  const { data: leads } = await supabase
    .from("crm_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const stages = ["new", "warm", "appointment_ready", "needs_follow_up", "not_ready"];

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">Home</Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Projects</Link>
          <Link href="/agents" className="rounded-xl bg-green-600 px-5 py-3 font-bold">Agents</Link>
          <Link href="/actions" className="rounded-xl bg-pink-600 px-5 py-3 font-bold">Actions</Link>
          <Link href="/crm" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">CRM</Link>
        </nav>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            CRM Lead Pipeline
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Term Life Lead CRM
          </h1>

          <p className="mt-4 text-zinc-400">
            Add leads, score them with AI, generate follow-ups, and book appointments.
          </p>
        </section>

        <div className="mt-8">
          <CrmLeadForm />
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-5">
          {stages.map((stage) => (
            <div key={stage} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
              <h2 className="text-lg font-black uppercase text-blue-400">{stage}</h2>

              <div className="mt-4 space-y-3">
                {(leads || [])
                  .filter((lead: any) => lead.stage === stage)
                  .map((lead: any) => (
                    <div key={lead.id} className="rounded-2xl bg-black p-4">
                      <p className="font-bold">{lead.name || "Unnamed Lead"}</p>
                      <p className="mt-1 text-sm text-zinc-400">{lead.phone}</p>
                      <p className="mt-2 text-sm font-bold text-green-400">Score: {lead.ai_score}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 space-y-5">
          {(leads || []).map((lead: any) => (
            <div key={lead.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-3xl font-black">{lead.name || "Unnamed Lead"}</h2>

                  <p className="mt-2 text-zinc-400">
                    {lead.phone} • {lead.email}
                  </p>

                  <p className="mt-3 text-sm font-bold uppercase text-blue-400">
                    Stage: {lead.stage} • Score: {lead.ai_score}
                  </p>

                  {lead.ai_summary && (
                    <p className="mt-3 text-zinc-400">{lead.ai_summary}</p>
                  )}

                  {lead.follow_up_message && (
                    <div className="mt-4 rounded-2xl border border-green-800 bg-green-950/30 p-4 text-green-100">
                      <p className="font-bold">Follow-Up Message</p>
                      <p className="mt-2">{lead.follow_up_message}</p>
                    </div>
                  )}

                  {lead.sms_draft && (
                    <div className="mt-4 rounded-2xl border border-purple-800 bg-purple-950/30 p-4 text-purple-100">
                      <p className="font-bold">SMS Draft</p>
                      <p className="mt-2">{lead.sms_draft}</p>
                    </div>
                  )}

                  {lead.email_draft && (
                    <div className="mt-4 rounded-2xl border border-blue-800 bg-blue-950/30 p-4 text-blue-100">
                      <p className="font-bold">Email Draft</p>
                      <p className="mt-2 whitespace-pre-wrap">{lead.email_draft}</p>
                    </div>
                  )}
                </div>

                <CrmLeadActions leadId={lead.id} />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}