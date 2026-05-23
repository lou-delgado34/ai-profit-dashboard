import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.14),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI Software Factory
            </p>
            <p className="text-sm text-zinc-400">Superagent Business Command Center</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl bg-blue-600 px-5 py-3 font-bold">Home</Link>
            <Link href="/projects" className="rounded-2xl bg-purple-600 px-5 py-3 font-bold">Projects</Link>
            <Link href="/agents" className="rounded-2xl bg-green-600 px-5 py-3 font-bold">Agents</Link>
            <Link href="/actions" className="rounded-2xl bg-pink-600 px-5 py-3 font-bold">Actions</Link>
          </div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-10 shadow-2xl">
            <p className="font-black uppercase tracking-[0.35em] text-green-400">
              Launch Dashboard
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
              Build Your AI Business System From One Place
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-zinc-300">
              Manage projects, run Superagents, review follow-up actions, create drafts,
              and keep your AI business workflow moving.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className="rounded-2xl bg-purple-600 px-7 py-4 text-lg font-black">
                Open Projects
              </Link>
              <Link href="/agents" className="rounded-2xl bg-green-600 px-7 py-4 text-lg font-black">
                Manage Agents
              </Link>
              <Link href="/actions" className="rounded-2xl bg-pink-600 px-7 py-4 text-lg font-black">
                Review Actions
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            {[
              ["01", "Projects", "Save app ideas and continue building."],
              ["02", "Agents", "Create AI helpers, chains, and triggers."],
              ["03", "Actions", "Review SMS, WhatsApp, and follow-up tasks."],
            ].map(([num, title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <p className="text-sm font-black text-blue-400">{num}</p>
                <h2 className="mt-2 text-3xl font-black">{title}</h2>
                <p className="mt-2 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}