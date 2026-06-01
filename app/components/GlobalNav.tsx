import Link from "next/link";

const links = [
  ["Home", "/"],
  ["CRM", "/crm"],
  ["SuperAgents", "/superagents"],
  ["Agent Chat", "/agent-chat"],
  ["Campaigns", "/campaigns"],
  ["Tasks", "/tasks"],
  ["Team", "/team"],
  ["Knowledge", "/knowledge"],
];

export default function GlobalNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-[#05070d]/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="shrink-0 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}