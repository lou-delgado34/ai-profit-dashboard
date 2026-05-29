"use client";

import { useState } from "react";

export default function AppointmentModal({
  leadId,
}: {
  leadId: string;
}) {
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleBook() {
    try {
      setLoading(true);

      const response = await fetch("/api/book-appointment", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          leadId,
          title: "Term Life Consultation",
          appointmentDate: date,
          appointmentTime: time,
          notes: "Booked from CRM",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Appointment booked successfully!");

      setOpen(false);

      location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl bg-orange-500 py-4 font-bold text-white"
      >
        Book Appointment
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-black p-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-xl bg-zinc-900 p-3 text-white"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full rounded-xl bg-zinc-900 p-3 text-white"
      />

      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full rounded-2xl bg-green-500 py-4 font-bold text-white"
      >
        {loading ? "Booking..." : "Confirm Appointment"}
      </button>
    </div>
  );
}