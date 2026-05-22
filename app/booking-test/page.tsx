"use client";

import { useState } from "react";

export default function BookingTestPage() {
  const [result, setResult] = useState("");

  const bookAppointment = async () => {
    const response = await fetch("/api/calendar/book-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Luis Delgado",
        email: "lou.delgado.pfs@gmail.com",
        title: "Term Life Review Appointment",
        description: "Booked by Superagent",
        start: "2026-05-23T15:00:00",
        end: "2026-05-23T15:30:00",
      }),
    });

    const data = await response.json();

    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-5xl font-black mb-6">Booking Test</h1>

      <button
        onClick={bookAppointment}
        className="rounded-xl bg-green-600 px-6 py-4 font-bold"
      >
        Book Real Appointment
      </button>

      <pre className="mt-8 whitespace-pre-wrap rounded-2xl bg-zinc-950 p-6">
        {result}
      </pre>
    </main>
  );
}