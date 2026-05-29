"use client";

import { useState } from "react";

const DEFAULT_EMAIL = "lou.delgado.pfs@gmail.com";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0/mo",
    credits: 10,
    features: ["10 credits", "Basic CRM", "Manual follow-ups"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49/mo",
    credits: 100,
    features: ["100 credits", "AI follow-ups", "WhatsApp + Email", "Task automation"],
  },
  {
    id: "elite",
    name: "Elite",
    price: "$99/mo",
    credits: 500,
    features: ["500 credits", "Team dashboard", "AI coaching", "Advanced CRM"],
  },
  {
    id: "admin",
    name: "Admin",
    price: "Unlimited",
    credits: 999999,
    features: ["Unlimited credits", "All access", "Admin controls", "No restrictions"],
  },
];

export default function BillingClient() {
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadSubscription = async () => {
    setLoading(true);

    const res = await fetch("/api/get-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not load subscription.");
      return;
    }

    setSubscription(data.subscription);
  };

  const updatePlan = async (plan: string) => {
    setLoading(true);

    const res = await fetch("/api/update-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, plan }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not update plan.");
      return;
    }

    setSubscription(data.subscription);
    alert(`Plan updated to ${plan}.`);
  };

  return (
    <section className="mt-8 space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-3xl font-black">Account Lookup</h2>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl bg-black p-4 text-white"
            placeholder="Email"
          />

          <button
            onClick={loadSubscription}
            disabled={loading}
            className="rounded-xl bg-pink-600 px-6 py-4 font-bold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load Account"}
          </button>
        </div>

        {subscription && (
          <div className="mt-6 rounded-2xl border border-green-800 bg-green-950/30 p-5">
            <p className="text-xl font-black">
              Current Plan: {subscription.plan}
            </p>

            <p className="mt-2 text-green-300">
              Credits: {subscription.credits}
            </p>

            <p className="mt-2 text-zinc-400">
              Admin: {subscription.is_admin ? "Yes" : "No"}
            </p>

            <p className="mt-2 text-zinc-400">
              Status: {subscription.status}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
          >
            <p className="text-sm font-bold uppercase text-pink-400">
              {plan.name}
            </p>

            <h3 className="mt-3 text-4xl font-black">
              {plan.price}
            </h3>

            <p className="mt-2 text-zinc-400">
              {plan.credits} credits
            </p>

            <div className="mt-5 space-y-2">
              {plan.features.map((feature) => (
                <p key={feature} className="text-sm text-zinc-300">
                  ✅ {feature}
                </p>
              ))}
            </div>

            <button
              onClick={() => updatePlan(plan.id)}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-pink-600 px-5 py-3 font-bold disabled:opacity-50"
            >
              Set {plan.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}