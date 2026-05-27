"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CrmLeadForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    language: "English",
    source: "manual",
    interest: "Term life insurance",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.name.trim()) {
      alert("Add lead name.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-crm-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Could not create lead.");
      return;
    }

    setForm({
      name: "",
      phone: "",
      email: "",
      language: "English",
      source: "manual",
      interest: "Term life insurance",
      notes: "",
    });

    router.refresh();
  };

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="text-3xl font-black">Add New Lead</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" className="rounded-2xl bg-black p-4" />
        <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" className="rounded-2xl bg-black p-4" />
        <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" className="rounded-2xl bg-black p-4" />

        <select value={form.language} onChange={(e) => update("language", e.target.value)} className="rounded-2xl bg-black p-4">
          <option>English</option>
          <option>Spanish</option>
        </select>

        <input value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="Source" className="rounded-2xl bg-black p-4" />
        <input value={form.interest} onChange={(e) => update("interest", e.target.value)} placeholder="Interest" className="rounded-2xl bg-black p-4" />
      </div>

      <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Notes" className="mt-4 min-h-28 w-full rounded-2xl bg-black p-4" />

      <button onClick={submit} disabled={loading} className="mt-4 rounded-xl bg-orange-600 px-6 py-3 font-bold">
        {loading ? "Adding..." : "Add Lead"}
      </button>
    </section>
  );
}