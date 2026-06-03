"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AgentChatClient from "./agent-chat-client";
import { useLanguage } from "../components/LanguageProvider";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const text = {
  en: {
    home: "Home",
    superagents: "SuperAgents",
    campaigns: "Campaigns",
    agentChat: "Agent Chat",
    label: "Live Agent Chat",
    title: "Chat With Your Agents",
    subtitle:
      "Ask one saved agent a question and get a role-specific answer using that agent’s instructions and memory.",
  },
  es: {
    home: "Inicio",
    superagents: "SuperAgentes",
    campaigns: "Campañas",
    agentChat: "Chat IA",
    label: "Chat en Vivo con Agentes",
    title: "Habla con Tus Agentes",
    subtitle:
      "Hazle una pregunta a un agente guardado y recibe una respuesta específica según su rol, instrucciones y memoria.",
  },
};

export default function AgentChatPage() {
  const { lang } = useLanguage();
  const t = text[lang === "es" ? "es" : "en"];

  const [agents, setAgents] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  async function loadData() {
    const { data: agentData } = await supabase
      .from("custom_agents")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    const { data: chatData } = await supabase
      .from("agent_chats")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    setAgents(agentData || []);
    setChats(chatData || []);
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

          <Link href="/agent-chat" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
            {t.agentChat}
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

        <AgentChatClient agents={agents || []} chats={chats || []} />
      </div>
    </main>
  );
}