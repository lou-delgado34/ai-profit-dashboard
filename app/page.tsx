import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 font-bold">
            Home
          </Link>

          <Link href="/projects" className="rounded-xl bg-purple-600 px-6 py-3 font-bold">
            Projects
          </Link>

          <Link href="/agents" className="rounded-xl bg-green-600 px-6 py-3 font-bold">
            Agents
          </Link>

          <Link href="/actions" className="rounded-xl bg-pink-600 px-6 py-3 font-bold">
            Actions
          </Link>
        </div>

        <p className="text-blue-400 font-bold uppercase tracking-widest">
          AI SOFTWARE FACTORY
        </p>

        <h1 className="text-6xl font-black mt-3">
          Command Center
        </h1>

        <p className="mt-4 text-zinc-400 text-xl">
          Build apps, manage projects, run AI agents, and control actions.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">

          <Link
            href="/projects"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-purple-500"
          >
            <h2 className="text-3xl font-black">Projects</h2>
            <p className="mt-3 text-zinc-400">
              View and manage all generated projects.
            </p>
          </Link>

          <Link
            href="/agents"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-green-500"
          >
            <h2 className="text-3xl font-black">Agents</h2>
            <p className="mt-3 text-zinc-400">
              Manage AI superagents and roles.
            </p>
          </Link>

          <Link
            href="/actions"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-pink-500"
          >
            <h2 className="text-3xl font-black">Actions</h2>
            <p className="mt-3 text-zinc-400">
              View action queue and automation tasks.
            </p>
          </Link>

        </div>
      </div>
    </main>
  );
}