import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CampaignsPage() {
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: outputs } = await supabase
    .from("agent_tool_outputs")
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
        </nav>

        <section className="rounded-3xl border border-orange-800 bg-orange-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-300">
            Export Center
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Campaigns + Deliverables
          </h1>

          <p className="mt-4 text-zinc-300">
            Open a campaign, copy it, print it, or save it as a PDF.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Campaigns</h2>

            <div className="mt-5 space-y-4">
              {(campaigns || []).length === 0 ? (
                <p className="text-zinc-500">No campaigns yet.</p>
              ) : (
                (campaigns || []).map((campaign: any) => (
                  <div
                    key={campaign.id}
                    className="rounded-2xl border border-zinc-800 bg-black p-5"
                  >
                    <p className="text-xl font-black">{campaign.title}</p>

                    <p className="mt-1 text-sm text-orange-300">
                      {campaign.campaign_type} • {campaign.status}
                    </p>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-zinc-400">
                      {campaign.content}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="rounded-xl bg-green-600 px-4 py-3 font-bold"
                      >
                        Open Export Page
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Tool Outputs</h2>

            <div className="mt-5 space-y-4">
              {(outputs || []).length === 0 ? (
                <p className="text-zinc-500">No tool outputs yet.</p>
              ) : (
                (outputs || []).map((output: any) => (
                  <div
                    key={output.id}
                    className="rounded-2xl border border-zinc-800 bg-black p-5"
                  >
                    <p className="text-xl font-black">{output.output_title}</p>

                    <p className="mt-1 text-sm text-purple-300">
                      {output.agent_name} • {output.tool_name}
                    </p>

                    <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-zinc-950 p-4 text-sm leading-7 text-zinc-300">
                      {output.output_content}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}