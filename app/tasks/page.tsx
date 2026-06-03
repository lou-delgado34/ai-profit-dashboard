"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import TasksClient from "./tasks-client";
import { useEffect, useState } from "react";
import { useLanguage } from "../components/LanguageProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const text = {
  en: {
    home: "Home",
    superagents: "SuperAgents",
    campaigns: "Campaigns",
    tasks: "Agent Tasks",
    label: "Delegation Center",
    title: "Agent Tasks",
    subtitle:
      "Click a task to open the full details. This keeps the page clean.",
  },

  es: {
    home: "Inicio",
    superagents: "SuperAgentes",
    campaigns: "Campañas",
    tasks: "Tareas",
    label: "Centro de Delegación",
    title: "Tareas de Agentes",
    subtitle:
      "Haz clic en una tarea para abrir todos los detalles. Esto mantiene la página limpia.",
  },
};

export default function TasksPage() {
  const { lang } = useLanguage();
  const t = text[lang === "es" ? "es" : "en"];

  const [tasks, setTasks] = useState<any[]>([]);

  async function loadData() {
    const { data } = await supabase
      .from("agent_tasks")
      .select("*")
      .order("created_at", { ascending: false });

    setTasks(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
            {t.home}
          </Link>

          <Link href="/superagents" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
            {t.superagents}
          </Link>

          <Link href="/campaigns" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
            {t.campaigns}
          </Link>

          <Link href="/tasks" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            {t.tasks}
          </Link>
        </nav>

        <section className="rounded-3xl border border-green-800 bg-green-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-green-300">
            {t.label}
          </p>

          <h1 className="mt-3 text-5xl font-black">
            {t.title}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            {t.subtitle}
          </p>
        </section>

        <TasksClient tasks={tasks} />
      </div>
    </main>
  );
}