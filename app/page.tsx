import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

      <div className="relative mx-auto max-w-7xl px-6 py-8">

        {/* Navigation */}
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/90 p-4 backdrop-blur-xl">

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-400">
              AI SOFTWARE FACTORY
            </p>
            <p className="text-xs text-zinc-500">
              AI Command Center
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-xl bg-blue-600 px-5 py-2 font-bold">
              Home
            </Link>

            <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-2 font-bold">
              Projects
            </Link>

            <Link href="/agents" className="rounded-xl bg-green-600 px-5 py-2 font-bold">
              Agents
            </Link>

            <Link href="/actions" className="rounded-xl bg-pink-600 px-5 py-2 font-bold">
              Actions
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-2 items-center">

          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-10 shadow-2xl">

            <p className="font-black uppercase tracking-[0.35em] text-green-400 text-sm">
              AI BUSINESS DASHBOARD
            </p>

            <h1 className="mt-5 text-4xl md:text-5xl font-black leading-tight">
              Run Your AI Business
              <br />
              From One Dashboard
            </h1>

            <p className="mt-5 text-lg text-zinc-400 max-w-xl leading-relaxed">
              Manage projects, launch AI agents, review follow-ups,
              automate actions, and keep your business moving from one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className="rounded-2xl bg-purple-600 px-6 py-3 font-bold">
                Open Projects
              </Link>

              <Link href="/agents" className="rounded-2xl bg-green-600 px-6 py-3 font-bold">
                AI Agents
              </Link>

              <Link href="/actions" className="rounded-2xl bg-pink-600 px-6 py-3 font-bold">
                Actions
              </Link>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="grid gap-5">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-blue-400 text-sm font-black">01</p>
              <h2 className="text-2xl font-black mt-2">Projects</h2>
              <p className="text-zinc-400 mt-2">
                Save ideas, generate systems, and continue building.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-green-400 text-sm font-black">02</p>
              <h2 className="text-2xl font-black mt-2">Agents</h2>
              <p className="text-zinc-400 mt-2">
                AI workers, chains, triggers, and smart automations.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-pink-400 text-sm font-black">03</p>
              <h2 className="text-2xl font-black mt-2">Actions</h2>
              <p className="text-zinc-400 mt-2">
                Review drafts, follow-ups, SMS, WhatsApp, and tasks.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}