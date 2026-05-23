import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.14),transparent_28%),linear-gradient(to_bottom,#050505,#09090b,#000)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 shadow-2xl backdrop-blur">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-400">
              AI Software Factory
            </p>
            <p className="text-xs text-zinc-500">
              Minimal AI Command Center
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700">Home</Link>
            <Link href="/projects" className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700">Projects</Link>
            <Link href="/agents" className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700">Agents</Link>
            <Link href="/actions" className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700">Actions</Link>
          </div>
        </nav>

        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              Projects • Superagents • Actions
            </p>

            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Your AI Business Command Center
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Build app ideas, manage AI Superagents, review follow-up tasks,
              and run your business workflow from one clean dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/agents" className="rounded-2xl bg-blue-600 px-6 py-3 font-black hover:bg-blue-700">
                Open Agents
              </Link>

              <Link href="/actions" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-6 py-3 font-black hover:bg-zinc-900">
                Review Actions
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/75 p-6 shadow-2xl backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-green-400">
                  System Status
                </p>
                <h2 className="mt-1 text-2xl font-black">Live Workspace</h2>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-bold text-green-300">
                Online
              </span>
            </div>

            <div className="grid gap-4">
              <Link href="/projects" className="rounded-2xl border border-zinc-800 bg-black/60 p-5 hover:border-blue-500">
                <p className="text-sm font-bold uppercase text-zinc-500">Module 01</p>
                <h3 className="mt-2 text-2xl font-black">Projects</h3>
                <p className="mt-2 text-sm text-zinc-400">Generated systems and saved app ideas.</p>
              </Link>

              <Link href="/agents" className="rounded-2xl border border-zinc-800 bg-black/60 p-5 hover:border-green-500">
                <p className="text-sm font-bold uppercase text-zinc-500">Module 02</p>
                <h3 className="mt-2 text-2xl font-black">Superagents</h3>
                <p className="mt-2 text-sm text-zinc-400">AI helpers, chains, triggers, and decisions.</p>
              </Link>

              <Link href="/actions" className="rounded-2xl border border-zinc-800 bg-black/60 p-5 hover:border-pink-500">
                <p className="text-sm font-bold uppercase text-zinc-500">Module 03</p>
                <h3 className="mt-2 text-2xl font-black">Action Queue</h3>
                <p className="mt-2 text-sm text-zinc-400">Gmail, WhatsApp, SMS drafts, and follow-ups.</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}