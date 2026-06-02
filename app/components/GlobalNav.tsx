"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function GlobalNav() {
  const { lang, setLang, t } = useLanguage();

  const links = [
    [t("Home", "Inicio"), "/"],
    ["CRM", "/crm"],
    [t("SuperAgents", "SuperAgentes"), "/superagents"],
    [t("Agent Chat", "Chat IA"), "/agent-chat"],
    [t("Campaigns", "Campañas"), "/campaigns"],
    [t("Tasks", "Tareas"), "/tasks"],
    [t("Team", "Equipo"), "/team"],
    [t("Knowledge", "Conocimiento"), "/knowledge"],
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-[#05070d]/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
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

        <div className="flex shrink-0 rounded-xl border border-zinc-700 bg-black p-1">
          <button
            onClick={() => setLang("en")}
            className={`rounded-lg px-3 py-2 text-sm font-black ${
              lang === "en" ? "bg-orange-600 text-white" : "text-zinc-400"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => setLang("es")}
            className={`rounded-lg px-3 py-2 text-sm font-black ${
              lang === "es" ? "bg-orange-600 text-white" : "text-zinc-400"
            }`}
          >
            ES
          </button>
        </div>
      </div>
    </div>
  );
}