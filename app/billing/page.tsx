import Link from "next/link";
import BillingClient from "./billing-client";

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">Home</Link>
          <Link href="/crm" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">CRM</Link>
          <Link href="/team" className="rounded-xl bg-green-600 px-5 py-3 font-bold">Team</Link>
          <Link href="/admin" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Admin</Link>
          <Link href="/billing" className="rounded-xl bg-pink-600 px-5 py-3 font-bold">Billing</Link>
        </nav>

        <section className="rounded-3xl border border-pink-800 bg-pink-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-300">
            SaaS Monetization
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Billing + Credits
          </h1>

          <p className="mt-4 text-zinc-300">
            Manage plans, credits, upgrades, and admin unlimited access.
          </p>
        </section>

        <BillingClient />
      </div>
    </main>
  );
}