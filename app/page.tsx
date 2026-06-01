import Link from "next/link";

const cards = [
  {
    title: "CRM",
    desc: "Manage leads, follow-ups, appointments, tasks, and AI coaching.",
    href: "/crm",
    color: "bg-orange-600",
  },
  {
    title: "Team",
    desc: "Track advisors, roles, licensing, and leaderboard.",
    href: "/team",
    color: "bg-green-600",
  },
  {
    title: "Admin",
    desc: "Manage team members, roles, and access levels.",
    href: "/admin",
    color: "bg-purple-600",
  },
  {
    title: "Billing",
    desc: "Manage credits, plans, and admin unlimited access.",
    href: "/billing",
    color: "bg-pink-600",
  },
  {
    title: "Projects",
    desc: "Continue building your AI software projects.",
    href: "/projects",
    color: "bg-blue-600",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400 md:text-sm">
            Team Avengers AI Business Platform
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight md:text-7xl">
            AI Business Command Center
          </h1>

          <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-400 md:text-xl">
            Manage leads, WhatsApp follow-ups, appointments, AI coaching, team tracking,
            billing, and business automation from one clean dashboard.
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

                <p className="text-sm leading-6 text-zinc-400">{card.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}