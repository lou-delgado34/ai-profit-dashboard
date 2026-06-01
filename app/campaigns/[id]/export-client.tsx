"use client";

export default function CampaignExportClient({ campaign }: { campaign: any }) {
  function copyCampaign() {
    navigator.clipboard.writeText(campaign.content || "");
    alert("Campaign copied.");
  }

  function printCampaign() {
    window.print();
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap gap-3 print:hidden">
        <button
          onClick={copyCampaign}
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold"
        >
          Copy Full Campaign
        </button>

        <button
          onClick={printCampaign}
          className="rounded-xl bg-green-600 px-5 py-3 font-bold"
        >
          Print / Save as PDF
        </button>
      </div>

      <article className="rounded-3xl border border-zinc-800 bg-white p-8 text-black shadow-2xl print:border-none print:shadow-none">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
          Team Avengers SuperAgent Campaign
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {campaign.title}
        </h1>

        <p className="mt-3 text-sm text-zinc-600">
          Type: {campaign.campaign_type} • Status: {campaign.status}
        </p>

        <hr className="my-6" />

        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-zinc-900">
          {campaign.content}
        </pre>
      </article>
    </section>
  );
}