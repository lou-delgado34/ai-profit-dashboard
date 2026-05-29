"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminTeamForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("advisor");
  const [licenseLevel, setLicenseLevel] = useState("life_only");
  const [loading, setLoading] = useState(false);

  const addMember = async () => {
    if (!name) {
      alert("Enter name.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-team-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        role,
        licenseLevel,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not add team member.");
      return;
    }

    setName("");
    setEmail("");
    setRole("advisor");
    setLicenseLevel("life_only");
    router.refresh();
  };

  return (
    <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="text-3xl font-black">Add Team Member</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl bg-black p-4 text-white"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="rounded-xl bg-black p-4 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="rounded-xl bg-black p-4 text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="rvp">RVP</option>
          <option value="advisor">Advisor</option>
          <option value="trainee">Trainee</option>
        </select>

        <select
          className="rounded-xl bg-black p-4 text-white"
          value={licenseLevel}
          onChange={(e) => setLicenseLevel(e.target.value)}
        >
          <option value="life_only">Life Only</option>
          <option value="life_and_securities">Life + Securities</option>
          <option value="unlicensed">Unlicensed</option>
        </select>
      </div>

      <button
        onClick={addMember}
        disabled={loading}
        className="mt-5 rounded-xl bg-purple-600 px-6 py-4 font-bold disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Team Member"}
      </button>
    </section>
  );
}