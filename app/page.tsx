import Link from "next/link";

const cards = [
  {
    title: "CRM",
    desc: "Manage leads, WhatsApp follow-ups, appointments, tasks, and AI coaching.",
    href: "/crm",
    color: "bg-orange-600",
  },
  {
    title: "Team",
    desc: "Track advisors, roles, licensing, team activity, and leaderboard.",
    href: "/team",
    color: "bg-green-600",
  },
  {
    title: "Admin",
    desc: "Add team members, assign access levels, and manage your platform.",
    href: "/admin",
    color: "bg-purple-600",
  },
  {
    title: "Billing",
    desc: "Manage credits, plans, admin access, and future subscriptions.",
    href: "/billing",
    color: "bg-pink-600",
  },
  {
    title: "Projects",
    desc: "Open app projects and continue building your AI software factory.",
    href: "/projects",
    color: "bg-blue-600",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex flex-wrap gap-2 rounded-3xl border border-zinc-800 bg-zinc-950 p-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold md:text-base">
            Home
          </Link>
          <Link href="/crm" className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-bold md:text-base">
            CRM
          </Link>
          <Link href="/team" className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-bold md:text-base">
            Team
          </Link>
          <Link href="/admin" className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-bold md:text-base">
            Admin
          </Link>
          <Link href="/billing" className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-bold md:text-base">
            Billing
          </Link>
          <Link href="/projects" className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-bold md:text-base">
            Projects
          </Link>
        </nav>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400 md:text-sm">
            Team Avengers AI Business Platform
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight md:text-7xl">
            AI CRM, Team, Billing, and Automation Command Center
          </h1>

          <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-400 md:text-xl">
            Manage leads, send WhatsApp follow-ups, book appointments, run AI coaching,
            track your team, and control your business platform from one place.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-3xl border border-zinc-800 bg-black p-5 hover:border-blue-500"
              >
                <div className={`mb-4 inline-block rounded-xl ${card.color} px-4 py-2 text-sm font-bold`}>
                  {card.title}
                </div>

                <p className="text-sm leading-6 text-zinc-400">
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">Platform Status</p>
            <h2 className="mt-2 text-3xl font-black text-green-400">Live</h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">CRM</p>
            <h2 className="mt-2 text-3xl font-black text-orange-400">Active</h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">AI Tools</p>
            <h2 className="mt-2 text-3xl font-black text-blue-400">Ready</h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">Admin Access</p>
            <h2 className="mt-2 text-3xl font-black text-purple-400">Unlimited</h2>
          </div>
        </section>
      </div>
    </main>
  );
}