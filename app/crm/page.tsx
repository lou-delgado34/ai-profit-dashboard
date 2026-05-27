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
            Add leads, score them with AI, and generate compliant follow-up messages.
          </p>
        </section>

        <div className="mt-8">
          <CrmLeadForm />
        </div>

        <section className="mt-8 space-y-5">
          {(leads || []).map((lead: any) => (
            <div
              key={lead.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-3xl font-black">{lead.name || "Unnamed Lead"}</h2>

                  <p className="mt-2 text-zinc-400">
                    {lead.phone} • {lead.email}
                  </p>

                  <p className="mt-3 text-sm font-bold uppercase text-blue-400">
                    Stage: {lead.stage} • Score: {lead.ai_score}
                  </p>

                  <p className="mt-3 text-zinc-400">
                    {lead.ai_summary}
                  </p>

                  {lead.follow_up_message && (
                    <div className="mt-4 rounded-2xl border border-green-800 bg-green-950/30 p-4 text-green-100">
                      {lead.follow_up_message}
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