"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SuperAgentClient from "./superagent-client";
import { useEffect, useState } from "react";
import { useLanguage } from "../components/LanguageProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const text = {
  en: {
    home: "Home",
    crm: "CRM",
    superagents: "SuperAgents",
    campaigns: "Campaigns",
    tasks: "Agent Tasks",

    label: "SuperAgent Admin Center",
    title: "Manage Your Agent Team",
    subtitle:
      "Create, edit, delete, manage memory, and track each agent's tasks and outputs.",
  },

  es: {
    home: "Inicio",
    crm: "CRM",
    superagents: "SuperAgentes",
    campaigns: "Campañas",
    tasks: "Tareas",

    label: "Centro Administrativo SuperAgente",
    title: "Administra Tu Equipo de Agentes",
    subtitle:
      "Crea, edita, elimina, administra memoria y monitorea tareas y resultados de cada agente.",
  },
};

export default function SuperAgentsPage() {
  const { lang } = useLanguage();
  const t = text[lang === "es" ? "es" : "en"];

  const [runs, setRuns] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  async function loadData() {
    const { data: runsData } = await supabase
      .from("superagent_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    const { data: agentsData } = await supabase
      .from("custom_agents")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: memoriesData } = await supabase
      .from("agent_memories")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: outputsData } = await supabase
      .from("agent_tool_outputs")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: tasksData } = await supabase
      .from("agent_tasks")
      .select("*")
      .order("created_at", { ascending: false });

    setRuns(runsData || []);
    setAgents(agentsData || []);
    setMemories(memoriesData || []);
    setOutputs(outputsData || []);
    setTasks(tasksData || []);
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

          <Link href="/crm" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
            {t.crm}
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

        <section className="rounded-3xl border border-purple-800 bg-purple-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-300">
            {t.label}
          </p>

          <h1 className="mt-3 text-5xl font-black">
            {t.title}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            {t.subtitle}
          </p>
        </section>

        <SuperAgentClient
          runs={runs}
          agents={agents}
          memories={memories}
          outputs={outputs}
          tasks={tasks}
        />
      </div>
    </main>
  );
}