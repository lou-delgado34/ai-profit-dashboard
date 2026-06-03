"use client";

import { createClient } from "@supabase/supabase-js";
import TeamClient from "./team-client";
import { useEffect, useState } from "react";
import { useLanguage } from "../components/LanguageProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const text = {
  en: {
    label: "Team Avengers",
    title: "Team Management Center",
    subtitle:
      "Add leaders, agents, viewers, and team members.",
  },

  es: {
    label: "Team Avengers",
    title: "Centro de Administración de Equipo",
    subtitle:
      "Agrega líderes, agentes, observadores y miembros del equipo.",
  },
};

export default function TeamPage() {
  const { lang } = useLanguage();
  const t = text[lang === "es" ? "es" : "en"];

  const [members, setMembers] = useState<any[]>([]);

  async function loadData() {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });

    setMembers(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-blue-800 bg-blue-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-300">
            {t.label}
          </p>

          <h1 className="mt-3 text-5xl font-black">
            {t.title}
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            {t.subtitle}
          </p>
        </section>

        <TeamClient members={members} />
      </div>
    </main>
  );
}