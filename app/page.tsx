"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const createProject = async () => {
    if (!prompt.trim()) {
      alert("Type the app you want to build first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-home-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Something went wrong.");
      return;
    }

    router.push(`/projects/${data.project.id}`);
  };

  const examples = [
    "Build me a CRM for life insurance agents",
    "Build me an AI recruiting CRM for financial services agents",
    "Build me a financial review app with appointments and scripts",
    "Build me an AI content system for social media automation",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.10),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur-xl">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI Software Factory
            </p>
            <p className="text-sm text-zinc-500">
              Build apps from plain English
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-xl bg-blue-600 px-5 py-2.5 font-bold">
              Home
            </Link>
            <Link href="/projects" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">
              Projects
            </Link>
            <Link href="/agents" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">
              Agents
            </Link>
            <Link href="/actions" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">
              Actions
            </Link>
          </div>
        </nav>

        <section className="mx-auto max-w-5xl text-center">
          <p className="mx-auto inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-bold text-blue-300">
            Base44-style App Generator
          </p>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            What app do you want to build?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Describe your app idea. The system will create a project workspace,
            build pack, code files, SQL, API routes, agents, actions, export ZIP,
            and launch checklist.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/60 p-5 text-left shadow-2xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[180px] w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-lg text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
              placeholder="Example: Build me a CRM for life insurance agents with leads, appointments, scripts, training, admin dashboard, AI follow-ups, and Supabase database."
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={createProject}
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-7 py-4 font-black hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating Project..." : "Generate App Project"}
              </button>

              <Link
                href="/projects"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-black hover:bg-white/10"
              >
                View Projects
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {examples.map((item) => (
              <button
                key={item}
                onClick={() => setPrompt(item)}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left text-sm font-bold text-zinc-300 hover:border-blue-500/60"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}