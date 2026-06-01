import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import CampaignExportClient from "./export-client";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const campaignId = resolvedParams.id;

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();

  if (error || !campaign) {
    return (
      <main className="min-h-screen bg-[#05070d] p-8 text-white">
        <p>Campaign not found.</p>

        <p className="mt-3 text-sm text-zinc-500">
          Campaign ID: {campaignId}
        </p>

        <Link
          href="/campaigns"
          className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold"
        >
          Back to Campaigns
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 flex flex-wrap gap-3 print:hidden">
          <Link
            href="/campaigns"
            className="rounded-xl bg-orange-600 px-5 py-3 font-bold"
          >
            Back to Campaigns
          </Link>

          <Link
            href="/superagents"
            className="rounded-xl bg-purple-600 px-5 py-3 font-bold"
          >
            SuperAgents
          </Link>
        </nav>

        <CampaignExportClient campaign={campaign} />
      </div>
    </main>
  );
}