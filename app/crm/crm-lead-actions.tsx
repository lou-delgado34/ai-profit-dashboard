"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CrmLeadActions({
  leadId,
  smsDraft,
  emailDraft,
}: {
  leadId: string;
  smsDraft?: string;
  emailDraft?: string;
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
      body: JSON.stringify({ leadId, ...body }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Action failed.");
      router.refresh();
      return;
    }

    router.refresh();
  };

  const updateStage = async () => {
    const stage = prompt(
      "New stage: new, warm, appointment_ready, needs_follow_up, not_ready"
    );

    if (!stage) return;

    await run("/api/update-lead-stage", { stage });
  };

  const bookAppointment = async () => {
    const appointmentDate = prompt(
      "Appointment date/time. Example: 2026-05-30 18:00"
    );

    if (!appointmentDate) return;

    await run("/api/create-crm-appointment", {
      appointmentDate,
      appointmentType: "Zoom",
      notes: "Booked from CRM.",
    });
  };

  const createManualTask = async () => {
    const title = prompt("Task title. Example: Call lead tonight");

    if (!title) return;

    await run("/api/create-crm-task", {
      taskType: "manual",
      title,
      description: "Manual task created from CRM.",
      priority: "normal",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <button onClick={() => run("/api/ai-score-lead")} disabled={loading} className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
        AI Score
      </button>

      <button onClick={() => run("/api/generate-lead-follow-up")} disabled={loading} className="rounded-xl bg-green-600 px-5 py-3 font-bold">
        Generate Follow-Up
      </button>

      <button onClick={() => run("/api/generate-sms-email-drafts")} disabled={loading} className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
        SMS + Email Drafts
      </button>

      <button onClick={() => run("/api/send-lead-sms")} disabled={loading} className="rounded-xl bg-cyan-600 px-5 py-3 font-bold">
        Send SMS / WhatsApp
      </button>

      <button onClick={() => run("/api/send-lead-email")} disabled={loading} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold">
        Send Email
      </button>

      <button
        onClick={() =>
          run("/api/mark-lead-communication", {
            channel: "sms",
            message: smsDraft || "",
          })
        }
        disabled={loading}
        className="rounded-xl bg-zinc-700 px-5 py-3 font-bold"
      >
        Mark SMS Sent
      </button>

      <button
        onClick={() =>
          run("/api/mark-lead-communication", {
            channel: "email",
            message: emailDraft || "",
          })
        }
        disabled={loading}
        className="rounded-xl bg-zinc-700 px-5 py-3 font-bold"
      >
        Mark Email Sent
      </button>

      <button onClick={updateStage} disabled={loading} className="rounded-xl bg-yellow-600 px-5 py-3 font-bold">
        Update Stage
      </button>

      <button onClick={bookAppointment} disabled={loading} className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
        Book Appointment
      </button>

      <button onClick={() => run("/api/start-follow-up-sequence")} disabled={loading} className="rounded-xl bg-red-600 px-5 py-3 font-bold">
        Start Follow-Up Sequence
      </button>

      <button onClick={createManualTask} disabled={loading} className="rounded-xl bg-slate-600 px-5 py-3 font-bold">
        Add Manual Task
      </button>
    </div>
  );
}