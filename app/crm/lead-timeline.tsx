"use client";

import { useState } from "react";

export default function LeadTimeline({ leadId }: { leadId: string }) {
  const [open, setOpen] = useState(false);
  const [timeline, setTimeline] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadTimeline = async () => {
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
    setOpen(true);
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={loadTimeline}
        disabled={loading}
        className="rounded-xl bg-zinc-700 px-5 py-3 font-bold hover:bg-zinc-600 disabled:opacity-50"
      >
        {loading ? "Loading..." : "View Timeline"}
      </button>

      {open && timeline && (
        <div className="mt-5 rounded-3xl border border-zinc-800 bg-black p-5">
          <h3 className="text-2xl font-black">Lead Timeline</h3>

          <div className="mt-5 space-y-5">
            <section>
              <h4 className="text-lg font-black text-blue-400">
                Activities
              </h4>

              <div className="mt-3 space-y-2">
                {timeline.activities?.length === 0 ? (
                  <p className="text-zinc-500">No activities yet.</p>
                ) : (
                  timeline.activities.map((item: any) => (
                    <div key={item.id} className="rounded-xl bg-zinc-950 p-3">
                      <p className="font-bold">{item.activity_type}</p>
                      <p className="text-zinc-400">{item.note}</p>
                      <p className="text-xs text-zinc-600">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-green-400">
                Communications
              </h4>

              <div className="mt-3 space-y-2">
                {timeline.communications?.length === 0 ? (
                  <p className="text-zinc-500">No communications yet.</p>
                ) : (
                  timeline.communications.map((item: any) => (
                    <div key={item.id} className="rounded-xl bg-zinc-950 p-3">
                      <p className="font-bold">
                        {item.channel} • {item.status}
                      </p>

                      <p className="text-zinc-400">{item.message}</p>

                      {item.provider_id && (
                        <p className="text-xs text-green-400">
                          Provider ID: {item.provider_id}
                        </p>
                      )}

                      {item.error_message && (
                        <p className="text-xs text-red-400">
                          Error: {item.error_message}
                        </p>
                      )}

                      <p className="text-xs text-zinc-600">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-orange-400">
                Appointments
              </h4>

              <div className="mt-3 space-y-2">
                {timeline.appointments?.length === 0 ? (
                  <p className="text-zinc-500">No appointments yet.</p>
                ) : (
                  timeline.appointments.map((item: any) => (
                    <div key={item.id} className="rounded-xl bg-zinc-950 p-3">
                      <p className="font-bold">
                        {item.appointment_type} • {item.status}
                      </p>
                      <p className="text-zinc-400">
                        {item.appointment_date}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}