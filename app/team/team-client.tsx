"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamClient({ members }: { members: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "agent",
  });

  async function addMember() {
    if (!form.fullName || !form.email) {
      alert("Enter name and email.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-team-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not add member.");
      return;
    }

    setForm({
      fullName: "",
      email: "",
      role: "agent",
    });

    router.refresh();
    alert("Team member added.");
  }

  async function deleteMember(memberId: string) {
    const ok = confirm("Delete team member?");
    if (!ok) return;

    setLoading(true);

    const res = await fetch("/api/delete-team-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ memberId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not delete member.");
      return;
    }

    router.refresh();
    alert("Team member deleted.");
  }

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-3xl font-black">Add Team Member</h2>

        <input
          value={form.fullName}
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value,
            })
          }
          placeholder="Full Name"
          className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        />

        <input
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          placeholder="Email"
          className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
          className="mt-3 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white"
        >
          <option value="owner">Owner</option>
          <option value="rvp">RVP</option>
          <option value="leader">Leader</option>
          <option value="agent">Agent</option>
          <option value="viewer">Viewer</option>
        </select>

        <button
          onClick={addMember}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-4 font-bold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Team Member"}
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-3xl font-black">Team Members</h2>

        <div className="mt-5 space-y-4">
          {members.length === 0 ? (
            <p className="text-zinc-500">No team members yet.</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-zinc-800 bg-black p-5"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xl font-black">
                      {member.name || "No name"}
                    </p>

                    <p className="text-zinc-400">{member.email}</p>

                    <p className="mt-2 text-sm text-zinc-500">
                      License: {member.license_level || "life_and_securities"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-bold text-blue-300">
                      {member.role}
                    </span>

                    <span className="rounded-full bg-green-950 px-3 py-1 text-xs font-bold text-green-300">
                      {member.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteMember(member.id)}
                  className="mt-4 rounded-xl bg-red-600 px-4 py-3 font-bold"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}