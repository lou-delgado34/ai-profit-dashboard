"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const generateApp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      router.push(`/projects/${data.projectId}`);
      router.refresh();
    } catch (err) {
      setError("AI generation failed. Check your API key and route file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
              Code Generation Engine
            </p>

            <h1 className="mt-2 text-5xl font-black">
              Build Full Apps From Plain English
            </h1>

            <p className="mt-3 max-w-3xl text-zinc-400">
              AI now generates app plans, SQL, pages, components, API routes,
              environment variables, and build steps.
            </p>
          </div>

          <Link
            href="/projects"
            className="rounded-xl bg-green-600 px-6 py-3 text-center font-bold hover:bg-green-700"
          >
            View Saved Projects
          </Link>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <label className="mb-3 block text-xl font-black">
            What app do you want to generate?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Build me a financial services CRM with term life leads, recruiting, appointments, training, dashboard, scripts, Supabase database, and admin controls."
            className="mb-5 h-60 w-full rounded-2xl border border-zinc-700 bg-black p-5 text-white outline-none focus:border-blue-500"
          />

          <button
            onClick={generateApp}
            disabled={loading || !prompt.trim()}
            className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-black hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating Code..." : "Generate Full App Blueprint"}
          </button>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500 bg-red-950 p-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}