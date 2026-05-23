import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.10),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur-xl">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI Software Factory
            </p>
            <p className="text-sm text-zinc-500">Minimal SaaS Command Center</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-xl bg-blue-600 px-5 py-2.5 font-bold">Home</Link>
            <Link href="/projects" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">Projects</Link>
            <Link href="/agents" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">Agents</Link>
            <Link href="/actions" className="rounded-xl bg-white/10 px-5 py-2.5 font-bold hover:bg-white/20">Actions</Link>
          </div>
        </nav>

        <section className="mx-auto max-w-5xl text-center">
          <p className="mx-auto inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-bold text-blue-300">
            Projects • Agents • Actions • Automation
          </p>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Build and Run Your AI Business From One Clean Dashboard
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            A simple command center for saved app ideas, AI Superagents,
            follow-up drafts, WhatsApp tasks, and business automation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/projects" className="rounded-2xl bg-blue-600 px-7 py-4 font-black hover:bg-blue-700">
              View Projects
            </Link>

            <Link href="/agents" className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-black hover:bg-white/10">
              Manage Agents
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-16 grid max-w-6xl gap-5 md:grid-cols-3">
          <Link href="/projects" className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur hover:border-blue-500/60">
            <p className="text-sm font-black uppercase tracking-widest text-blue-400">01 / Projects</p>
            <h2 className="mt-4 text-2xl font-black">Saved Systems</h2>
            <p className="mt-3 text-zinc-400">Store app ideas and continue building without starting over.</p>
          </Link>

          <Link href="/agents" className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur hover:border-green-500/60">
            <p className="text-sm font-black uppercase tracking-widest text-green-400">02 / Agents</p>
            <h2 className="mt-4 text-2xl font-black">AI Workers</h2>
            <p className="mt-3 text-zinc-400">Create helpers, chains, triggers, and smart decisions.</p>
          </Link>

          <Link href="/actions" className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur hover:border-pink-500/60">
            <p className="text-sm font-black uppercase tracking-widest text-pink-400">03 / Actions</p>
            <h2 className="mt-4 text-2xl font-black">Action Queue</h2>
            <p className="mt-3 text-zinc-400">Review drafts, follow-ups, WhatsApp tasks, and next steps.</p>
          </Link>
        </section>
      </div>
    </main>
  );
}