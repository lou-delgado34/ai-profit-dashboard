"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentActions({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const run = async (url: string, body: any = {}) => {
    setLoading(true);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId,
        ...body,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Action failed.");
      return;
    }

    router.refresh();
  };

  const updateStatus = async () => {
    const status = prompt(
      "New status: scheduled, confirmed, completed, no_show, cancelled"
    );

    if (!status) return;

    await run("/api/update-appointment-status", { status });
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        onClick={() => run("/api/generate-appointment-reminder")}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-4 py-3 font-bold disabled:opacity-50"
      >
        Generate Reminder
      </button>

      <button
        onClick={() => run("/api/mark-reminder-sent")}
        disabled={loading}
        className="rounded-xl bg-green-600 px-4 py-3 font-bold disabled:opacity-50"
      >
        Mark Reminder Sent
      </button>

      <button
        onClick={updateStatus}
        disabled={loading}
        className="rounded-xl bg-orange-600 px-4 py-3 font-bold disabled:opacity-50"
      >
        Update Status
      </button>
    </div>
  );
}