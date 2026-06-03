"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import KnowledgeClient from "./knowledge-client";
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
    agentChat: "Agent Chat",
    knowledge: "Knowledge Base",

    label: "Team Avengers Knowledge Base",
    title: "Agent Training Library",
    subtitle:
      "Save scripts, training notes, recruiting materials, term life education, and Spanish scripts for your agents to use.",
  },

  es: {
    home: "Inicio",
    superagents: "SuperAgentes",
    agentChat: "Chat IA",
    knowledge: "Base de Conocimiento",

    label: "Base de Conocimiento Team Avengers",
    title: "Biblioteca de Entrenamiento",
    subtitle:
      "Guarda guiones, notas de entrenamiento, materiales de reclutamiento, educación de seguro de vida a término y guiones en español para tus agentes.",
  },
};

export default function KnowledgePage() {
  const { lang } = useLanguage();
  const t = text[lang === "es" ? "es" : "en"];

  const [knowledge, setKnowledge] = useState<any[]>([]);

  async function loadData() {
    const { data } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("created_at", { ascending: false });

    setKnowledge(data || []);
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

          <Link href="/agent-chat" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            {t.agentChat}
          </Link>

          <Link href="/knowledge" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">
            {t.knowledge}
          </Link>
        </nav>

        <section className="rounded-3xl border border-orange-800 bg-orange-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-300">
            {t.label}
          </p>

          <h1 className="mt-3 text-5xl font-black">
            {t.title}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            {t.subtitle}
          </p>
        </section>

        <KnowledgeClient knowledge={knowledge} />
      </div>
    </main>
  );
}