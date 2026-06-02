"use client";

import Link from "next/link";
import { useLanguage } from "./components/LanguageProvider";

export default function HomePage() {
  const { t } = useLanguage();

  const mainApps = [
    {
      title: "CRM",
      href: "/crm",
      description: t(
        "Manage leads, pipeline, appointments, and follow-ups.",
        "Administra prospectos, embudo, citas y seguimientos."
      ),
      color: "bg-orange-600",
    },
    {
      title: t("SuperAgents", "SuperAgentes"),
      href: "/superagents",
      description: t(
        "Run your AI agent team and build campaigns.",
        "Ejecuta tu equipo de agentes IA y crea campañas."
      ),
      color: "bg-purple-600",
    },
    {
      title: t("Agent Chat", "Chat IA"),
      href: "/agent-chat",
      description: t(
        "Chat directly with one agent.",
        "Habla directamente con un agente."
      ),
      color: "bg-green-600",
    },
    {
      title: t("Campaigns", "Campañas"),
      href: "/campaigns",
      description: t(
        "Open saved campaigns and export deliverables.",
        "Abre campañas guardadas y exporta entregables."
      ),
      color: "bg-blue-600",
    },
  ];

  const tools = [
    { title: t("Agent Tasks", "Tareas"), href: "/tasks", color: "bg-green-600" },
    { title: t("Team", "Equipo"), href: "/team", color: "bg-blue-600" },
    { title: t("Knowledge Base", "Base de Conocimiento"), href: "/knowledge", color: "bg-orange-600" },
    { title: t("Billing", "Facturación"), href: "/billing", color: "bg-pink-600" },
    { title: t("Projects", "Proyectos"), href: "/projects", color: "bg-purple-600" },
  ];

  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-400">
            Team Avengers AI Platform
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            {t("SuperAgent Business Command Center", "Centro de Comando SuperAgent")}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            {t(
              "Create campaigns, manage leads, chat with agents, save knowledge, and export business-ready assets.",
              "Crea campañas, administra prospectos, habla con agentes, guarda conocimiento y exporta materiales listos para usar."
            )}
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

              <p className="mt-6 font-bold text-orange-400">
                {t("Open →", "Abrir →")}
              </p>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-orange-800 bg-orange-950/10 p-6">
          <h2 className="text-3xl font-black">{t("Tools", "Herramientas")}</h2>

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
      </div>
    </main>
  );
}