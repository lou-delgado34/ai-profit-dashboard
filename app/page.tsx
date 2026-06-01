import Link from "next/link";

const mainApps = [
  {
    title: "CRM",
    href: "/crm",
    description: "Manage leads, pipeline, appointments, and follow-ups.",
    color: "bg-orange-600",
  },
  {
    title: "SuperAgents",
    href: "/superagents",
    description: "Run your AI agent team and build campaigns.",
    color: "bg-purple-600",
  },
  {
    title: "Agent Chat",
    href: "/agent-chat",
    description: "Chat directly with one agent.",
    color: "bg-green-600",
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    description: "Open saved campaigns and export deliverables.",
    color: "bg-blue-600",
  },
];

const tools = [
  { title: "Agent Tasks", href: "/tasks", color: "bg-green-600" },
  { title: "Team", href: "/team", color: "bg-blue-600" },
  { title: "Knowledge Base", href: "/knowledge", color: "bg-orange-600" },
  { title: "Billing", href: "/billing", color: "bg-pink-600" },
  { title: "Projects", href: "/projects", color: "bg-purple-600" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-400">
            Team Avengers AI Platform
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            SuperAgent Business Command Center
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Create campaigns, manage leads, chat with agents, save knowledge,
            and export business-ready assets.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {mainApps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl transition hover:-translate-y-1 hover:border-orange-500"
            >
              <span className={`rounded-2xl ${app.color} px-4 py-2 text-sm font-black`}>
                {app.title}
              </span>

              <h2 className="mt-6 text-3xl font-black">{app.title}</h2>

              <p className="mt-3 min-h-20 leading-7 text-zinc-400">
                {app.description}
              </p>

              <p className="mt-6 font-bold text-orange-400">Open →</p>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-orange-800 bg-orange-950/10 p-6">
          <h2 className="text-3xl font-black">Tools</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-5">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`rounded-2xl ${tool.color} px-5 py-5 text-center text-lg font-black text-white shadow-lg transition hover:scale-[1.03]`}
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-green-800 bg-green-950/20 p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-green-300">
            Launch Status
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <StatusCard label="CRM" value="Ready" />
            <StatusCard label="SuperAgents" value="Ready" />
            <StatusCard label="Campaigns" value="Ready" />
            <StatusCard label="Knowledge" value="Ready" />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black p-5">
      <p className="text-sm uppercase text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-green-300">{value}</p>
    </div>
  );
}