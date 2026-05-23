import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap gap-4">
          <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 font-bold">Home</Link>
          <Link href="/projects" className="rounded-xl bg-purple-600 px-6 py-3 font-bold">Projects</Link>
          <Link href="/agents" className="rounded-xl bg-green-600 px-6 py-3 font-bold">Agents</Link>
          <Link href="/actions" className="rounded-xl bg-pink-600 px-6 py-3 font-bold">Actions</Link>
        </div>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-10 shadow-2xl">
          <p className="font-bold uppercase tracking-[0.35em] text-blue-400">
            AI SOFTWARE FACTORY
          </p>

          <h1 className="mt-5 max-w-4xl text-6xl font-black leading-tight">
            Build, Manage, and Launch Your AI Business System
          </h1>

          <p className="mt-6 max-w-3xl text-xl text-zinc-400">
            Create projects, run AI Superagents, review action tasks, and move your system closer to launch.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/projects" className="rounded-2xl bg-purple-600 px-7 py-4 font-black">
              View Projects
            </Link>
            <Link href="/agents" className="rounded-2xl bg-green-600 px-7 py-4 font-black">
              Open Agents
            </Link>
            <Link href="/actions" className="rounded-2xl bg-pink-600 px-7 py-4 font-black">
              Action Queue
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <Link href="/projects" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-purple-500">
            <p className="text-sm font-bold uppercase tracking-widest text-purple-400">Step 1</p>
            <h2 className="mt-3 text-3xl font-black">Projects</h2>
            <p className="mt-3 text-zinc-400">Save and continue building your app ideas.</p>
          </Link>

          <Link href="/agents" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-green-500">
            <p className="text-sm font-bold uppercase tracking-widest text-green-400">Step 2</p>
            <h2 className="mt-3 text-3xl font-black">Agents</h2>
            <p className="mt-3 text-zinc-400">Create AI helpers, chains, triggers, and decisions.</p>
          </Link>

          <Link href="/actions" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-pink-500">
            <p className="text-sm font-bold uppercase tracking-widest text-pink-400">Step 3</p>
            <h2 className="mt-3 text-3xl font-black">Actions</h2>
            <p className="mt-3 text-zinc-400">Review messages, drafts, WhatsApp tasks, and follow-ups.</p>
          </Link>
        </section>
      </div>
    </main>
  );
}