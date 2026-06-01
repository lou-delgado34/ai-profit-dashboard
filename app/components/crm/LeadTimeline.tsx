"use client";

import { useEffect, useState } from "react";

export default function LeadTimeline({ leadId }: { leadId: string }) {
  const [timeline, setTimeline] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadTimeline() {
    if (!leadId) return;

    setLoading(true);

    const res = await fetch("/api/get-lead-timeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ leadId }),
    });

    const data = await res.json();

    setTimeline(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTimeline();
  }, [leadId]);

  const activities = timeline?.activities || [];
  const communications = timeline?.communications || [];
  const appointments = timeline?.appointments || [];

  const items = [
    ...activities.map((item: any) => ({
      id: `activity-${item.id}`,
      type: item.activity_type || "Activity",
      text: item.note || "Activity logged.",
      date: item.created_at,
    })),
    ...communications.map((item: any) => ({
      id: `communication-${item.id}`,
      type: `${item.channel || "message"} ${item.status || ""}`,
      text: item.message || item.error_message || "Communication logged.",
      date: item.created_at,
    })),
    ...appointments.map((item: any) => ({
      id: `appointment-${item.id}`,
      type: `Appointment ${item.status || ""}`,
      text: item.appointment_date || "Appointment logged.",
      date: item.created_at,
    })),
  ].sort(
    (a, b) =>
      new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );

  return (
    <section className="rounded-3xl border border-zinc-800 bg-black p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Timeline
          </p>

          <h3 className="mt-1 text-2xl font-black">
            Lead Activity
          </h3>
        </div>

        <button
          onClick={loadTimeline}
          disabled={loading}
          className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No timeline activity yet.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <p className="text-sm font-bold uppercase text-blue-400">
                {item.type}
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {item.text}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                {item.date ? new Date(item.date).toLocaleString() : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}