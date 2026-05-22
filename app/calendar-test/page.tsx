"use client";

import { useState } from "react";

export default function CalendarTestPage() {
  const [result, setResult] = useState("");

  const createEvent = async () => {
    const response = await fetch("/api/calendar/create-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Superagent Test Appointment",
        description: "Calendar integration test",
        start: "2026-05-22T14:00:00",
        end: "2026-05-22T14:30:00",
      }),
    });

    const data = await response.json();

    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-5xl font-black mb-6">Calendar Test</h1>

      <button
        onClick={createEvent}
        className="rounded-xl bg-blue-600 px-6 py-4 font-bold"
      >
        Create Google Calendar Event
      </button>

      <pre className="mt-8 whitespace-pre-wrap rounded-2xl bg-zinc-950 p-6">
        {result}
      </pre>
    </main>
  );
}