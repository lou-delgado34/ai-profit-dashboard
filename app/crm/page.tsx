"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import LeadTimeline from "../components/crm/LeadTimeline";
import LeadNotes from "../components/crm/LeadNotes";
import LeadTags from "../components/crm/LeadTags";
import PipelineBoard from "../components/crm/PipelineBoard";
import { useLanguage } from "../components/LanguageProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const text = {
  en: {
    team: "Team Avengers",
    commandCenter: "CRM Command Center",
    dashboard: "🏠 Dashboard",
    leads: "👥 Leads",
    appointments: "📅 Appointments",
    aiCoach: "🤖 AI Coach",
    reports: "📈 Reports",
    settings: "⚙️ Settings",
    crmTitle: "Team Avengers CRM",
    leadCommand: "Lead Command Center",
    subtitle: "Manage leads, appointments, AI coaching and follow-ups.",
    newLead: "+ New Lead",
    newAppointment: "+ New Appointment",
    generateAI: "Generate AI",
    totalLeads: "Total Leads",
    appointmentsSet: "Appointments Set",
    hotLeads: "Hot Leads",
    conversion: "Conversion %",
    searchLeads: "Search Leads",
    searchPlaceholder: "Search by name, phone, or email",
    today: "Today",
    appointmentsToday: "Appointments Today",
    tasksDue: "Tasks Due",
    quickActions: "Quick Actions",
    appointmentTitle: "Appointments",
    termLifeConsultation: "Term Life Consultation",
    lead: "Lead",
    unknown: "Unknown",
    noDate: "No date",
    status: "Status",
    crmSettings: "CRM Settings",
    english: "English",
    spanish: "Spanish",
    on: "On",
    off: "Off",
    saveSettings: "Save Settings",
    newLeadTitle: "New Lead",
    notes: "Notes",
    saveLead: "Save Lead",
    cancel: "Cancel",
    selectLead: "Select a lead to view details.",
    unnamedLead: "Unnamed Lead",
    phone: "Phone",
    email: "Email",
    noPhone: "No phone",
    noEmail: "No email",
    stage: "Stage",
    aiScore: "AI Score",
    nextBestAction: "Next Best Action",
    generateNext: "Generate AI to get the next best action.",
    followUp: "Follow Up",
    timeline: "Timeline",
    notesTab: "Notes",
    followUpDraft: "Follow-Up Draft",
    noDraft: "No draft yet.",
    copyDraft: "Copy Draft",
    openSms: "Open SMS",
    openEmail: "Open Email",
    generateFollowUp: "Generate Follow Up",
    sendMessage: "Send Message",
    draftCopied: "Draft copied.",
    noDraftAvailable: "No draft available.",
    noPhoneAlert: "Lead has no phone number.",
    noEmailAlert: "Lead has no email.",
    selectLeadAlert: "Select a lead first.",
    actionFailed: "Action failed.",
    couldNotAddLead: "Could not add lead.",
    quickFollowUp: "Quick follow-up",
    followUpMessage: "Hi, just following up with you.",
    coachDefault:
      "• Thank the lead\n• Explain term life simply\n• Ask questions\n• Schedule appointment",
    topProducer: "Top Producer",
  },
  es: {
    team: "Team Avengers",
    commandCenter: "Centro de Comando CRM",
    dashboard: "🏠 Panel",
    leads: "👥 Prospectos",
    appointments: "📅 Citas",
    aiCoach: "🤖 Coach IA",
    reports: "📈 Reportes",
    settings: "⚙️ Configuración",
    crmTitle: "CRM Team Avengers",
    leadCommand: "Centro de Prospectos",
    subtitle: "Administra prospectos, citas, coach IA y seguimientos.",
    newLead: "+ Nuevo Prospecto",
    newAppointment: "+ Nueva Cita",
    generateAI: "Generar IA",
    totalLeads: "Total Prospectos",
    appointmentsSet: "Citas Agendadas",
    hotLeads: "Prospectos Calientes",
    conversion: "Conversión %",
    searchLeads: "Buscar Prospectos",
    searchPlaceholder: "Buscar por nombre, teléfono o correo",
    today: "Hoy",
    appointmentsToday: "Citas de Hoy",
    tasksDue: "Tareas Pendientes",
    quickActions: "Acciones Rápidas",
    appointmentTitle: "Citas",
    termLifeConsultation: "Consulta de Seguro de Vida a Término",
    lead: "Prospecto",
    unknown: "Desconocido",
    noDate: "Sin fecha",
    status: "Estado",
    crmSettings: "Configuración CRM",
    english: "Inglés",
    spanish: "Español",
    on: "Activado",
    off: "Desactivado",
    saveSettings: "Guardar Configuración",
    newLeadTitle: "Nuevo Prospecto",
    notes: "Notas",
    saveLead: "Guardar Prospecto",
    cancel: "Cancelar",
    selectLead: "Selecciona un prospecto para ver detalles.",
    unnamedLead: "Prospecto Sin Nombre",
    phone: "Teléfono",
    email: "Correo",
    noPhone: "Sin teléfono",
    noEmail: "Sin correo",
    stage: "Etapa",
    aiScore: "Puntuación IA",
    nextBestAction: "Mejor Próxima Acción",
    generateNext: "Genera IA para recibir la mejor próxima acción.",
    followUp: "Seguimiento",
    timeline: "Historial",
    notesTab: "Notas",
    followUpDraft: "Borrador de Seguimiento",
    noDraft: "Todavía no hay borrador.",
    copyDraft: "Copiar Borrador",
    openSms: "Abrir SMS",
    openEmail: "Abrir Correo",
    generateFollowUp: "Generar Seguimiento",
    sendMessage: "Enviar Mensaje",
    draftCopied: "Borrador copiado.",
    noDraftAvailable: "No hay borrador disponible.",
    noPhoneAlert: "El prospecto no tiene número de teléfono.",
    noEmailAlert: "El prospecto no tiene correo electrónico.",
    selectLeadAlert: "Selecciona un prospecto primero.",
    actionFailed: "La acción falló.",
    couldNotAddLead: "No se pudo agregar el prospecto.",
    quickFollowUp: "Seguimiento rápido",
    followUpMessage: "Hola, solo quería darle seguimiento.",
    coachDefault:
      "• Agradece al prospecto\n• Explica el seguro de vida a término de forma simple\n• Haz preguntas\n• Agenda una cita",
    topProducer: "Mejor Productor",
  },
};

export default function CrmPage() {
  const { lang } = useLanguage();
  const t = text[lang === "es" ? "es" : "en"];

  const [activeTab, setActiveTab] = useState("dashboard");
  const [detailTab, setDetailTab] = useState("coach");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    language: lang === "es" ? "Spanish" : "English",
    source: "manual",
    product: "Term life insurance",
    notes: "",
  });

  async function loadData() {
    const { data: leadData } = await supabase
      .from("crm_leads")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: apptData } = await supabase
      .from("crm_appointments")
      .select("*, crm_leads(name)")
      .order("appointment_date", { ascending: true });

    const { data: recData } = await supabase
      .from("crm_ai_recommendations")
      .select("*")
      .order("created_at", { ascending: false });

    setLeads(leadData || []);
    setAppointments(apptData || []);
    setRecommendations(recData || []);

    if (!selectedLead && leadData && leadData.length > 0) {
      setSelectedLead(leadData[0]);
    }

    if (selectedLead && leadData) {
      const refreshed = leadData.find((lead: any) => lead.id === selectedLead.id);
      if (refreshed) setSelectedLead(refreshed);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return leads;

    return leads.filter((lead) =>
      `${lead.name || ""} ${lead.phone || ""} ${lead.email || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [leads, search]);

  const hotLeads = leads.filter((lead) => (lead.ai_score || 0) >= 70).length;
  const conversion =
    leads.length === 0 ? 0 : Math.round((appointments.length / leads.length) * 100);

  const today = new Date().toDateString();

  const appointmentsToday = appointments.filter((appt) =>
    appt.appointment_date
      ? new Date(appt.appointment_date).toDateString() === today
      : false
  ).length;

  const selectedRecommendations = recommendations.filter(
    (item) => item.lead_id === selectedLead?.id
  );

  const nextBestAction = selectedRecommendations.find(
    (item) => item.recommendation_type === "next_best_action"
  );

  const salesCoach = selectedRecommendations.find(
    (item) => item.recommendation_type === "sales_coach"
  );

  async function addLead() {
    setLoading(true);

    const res = await fetch("/api/create-crm-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || t.couldNotAddLead);
      return;
    }

    setShowLeadModal(false);
    setNewLead({
      name: "",
      phone: "",
      email: "",
      language: lang === "es" ? "Spanish" : "English",
      source: "manual",
      product: "Term life insurance",
      notes: "",
    });

    await loadData();
  }

  async function runLeadAction(endpoint: string) {
    if (!selectedLead) {
      alert(t.selectLeadAlert);
      return;
    }

    setLoading(true);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: selectedLead.id, language: lang }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || t.actionFailed);
      return;
    }

    await loadData();
  }

  async function generateAI() {
    if (!selectedLead) {
      alert(t.selectLeadAlert);
      return;
    }

    await runLeadAction("/api/generate-lead-follow-up");
    await runLeadAction("/api/generate-next-best-action");
    await runLeadAction("/api/generate-ai-sales-coach");
  }

  function copyDraft() {
    const draft =
      selectedLead?.follow_up_message ||
      selectedLead?.sms_draft ||
      t.noDraftAvailable;

    navigator.clipboard.writeText(draft);
    alert(t.draftCopied);
  }

  function openSms() {
    if (!selectedLead?.phone) {
      alert(t.noPhoneAlert);
      return;
    }

    const message =
      selectedLead?.sms_draft ||
      selectedLead?.follow_up_message ||
      t.followUpMessage;

    window.location.href = `sms:${selectedLead.phone}?body=${encodeURIComponent(message)}`;
  }

  function openEmail() {
    if (!selectedLead?.email) {
      alert(t.noEmailAlert);
      return;
    }

    const subject = t.quickFollowUp;
    const body =
      selectedLead?.email_draft ||
      selectedLead?.follow_up_message ||
      t.followUpMessage;

    window.location.href = `mailto:${selectedLead.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  const coachText = salesCoach?.recommendation || t.coachDefault;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="flex max-w-full overflow-hidden">
        <aside className="hidden min-h-screen w-[220px] shrink-0 border-r border-zinc-800 bg-zinc-950 p-5 md:block">
          <h1 className="text-2xl font-black">{t.team}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t.commandCenter}</p>

          <nav className="mt-10 space-y-3">
            {[
              ["dashboard", t.dashboard],
              ["leads", t.leads],
              ["appointments", t.appointments],
              ["ai", t.aiCoach],
              ["reports", t.reports],
              ["settings", t.settings],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full rounded-2xl px-4 py-3 text-left font-bold transition ${
                  activeTab === id
                    ? "bg-orange-600 shadow-lg shadow-orange-900/30"
                    : "bg-black hover:bg-zinc-900"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-400">
                  {t.crmTitle}
                </p>
                <h2 className="mt-2 text-4xl font-black">{t.leadCommand}</h2>
                <p className="mt-2 text-zinc-400">{t.subtitle}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowLeadModal(true)}
                  className="rounded-2xl bg-orange-600 px-5 py-3 font-bold"
                >
                  {t.newLead}
                </button>

                <button
                  onClick={() => setActiveTab("appointments")}
                  className="rounded-2xl bg-blue-600 px-5 py-3 font-bold"
                >
                  {t.newAppointment}
                </button>

                <button
                  onClick={generateAI}
                  disabled={loading}
                  className="rounded-2xl bg-purple-600 px-5 py-3 font-bold disabled:opacity-50"
                >
                  {t.generateAI}
                </button>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 space-y-6">
                <section className="grid gap-4 md:grid-cols-4">
                  <StatCard label={t.totalLeads} value={leads.length} color="border-orange-500" />
                  <StatCard label={t.appointmentsSet} value={appointments.length} color="border-blue-500" />
                  <StatCard label={t.hotLeads} value={hotLeads} color="border-green-500" />
                  <StatCard label={t.conversion} value={`${conversion}%`} color="border-purple-500" />
                </section>

                <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl">
                  <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
                    {t.searchLeads}
                  </p>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none focus:border-orange-500"
                  />
                </section>

                {(activeTab === "dashboard" || activeTab === "leads") && (
                  <>
                    <PipelineBoard
                      leads={filteredLeads}
                      selectedLead={selectedLead}
                      setSelectedLead={setSelectedLead}
                      onStageUpdated={loadData}
                    />

                    <LeadDetails
                      lead={selectedLead}
                      detailTab={detailTab}
                      setDetailTab={setDetailTab}
                      nextBestAction={nextBestAction}
                      coachText={coachText}
                      runLeadAction={runLeadAction}
                      copyDraft={copyDraft}
                      openSms={openSms}
                      openEmail={openEmail}
                      loading={loading}
                      loadData={loadData}
                      t={t}
                    />
                  </>
                )}

                {activeTab === "appointments" && (
                  <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <h2 className="text-3xl font-black">{t.appointmentTitle}</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {appointments.map((appt) => (
                        <div key={appt.id} className="rounded-2xl border border-zinc-800 bg-black p-5">
                          <p className="text-xl font-black">{appt.title || t.termLifeConsultation}</p>
                          <p className="mt-2 text-zinc-400">{t.lead}: {appt.crm_leads?.name || t.unknown}</p>
                          <p className="mt-2 text-blue-400">
                            {appt.appointment_date
                              ? new Date(appt.appointment_date).toLocaleString()
                              : t.noDate}
                          </p>
                          <p className="mt-2 text-sm text-zinc-500">{t.status}: {appt.status}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === "ai" && (
                  <LeadDetails
                    lead={selectedLead}
                    detailTab={detailTab}
                    setDetailTab={setDetailTab}
                    nextBestAction={nextBestAction}
                    coachText={coachText}
                    runLeadAction={runLeadAction}
                    copyDraft={copyDraft}
                    openSms={openSms}
                    openEmail={openEmail}
                    loading={loading}
                    loadData={loadData}
                    t={t}
                  />
                )}

                {activeTab === "reports" && (
                  <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <h2 className="text-3xl font-black">{t.reports}</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <StatCard label={t.totalLeads} value={leads.length} color="border-orange-500" />
                      <StatCard label={t.appointments} value={appointments.length} color="border-blue-500" />
                      <StatCard label={t.conversion} value={`${conversion}%`} color="border-purple-500" />
                      <StatCard label={t.topProducer} value="Lou" color="border-green-500" />
                    </div>
                  </section>
                )}

                {activeTab === "settings" && (
                  <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <h2 className="text-3xl font-black">{t.crmSettings}</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <input className="rounded-xl bg-black p-4" defaultValue="Team Avengers" />
                      <select className="rounded-xl bg-black p-4" defaultValue={lang === "es" ? "Spanish" : "English"}>
                        <option>English</option>
                        <option>Spanish</option>
                      </select>
                      <input className="rounded-xl bg-black p-4" defaultValue="Term life insurance" />
                      <select className="rounded-xl bg-black p-4" defaultValue="On">
                        <option>On</option>
                        <option>Off</option>
                      </select>
                    </div>
                    <button className="mt-5 rounded-2xl bg-green-600 px-6 py-4 font-bold">
                      {t.saveSettings}
                    </button>
                  </section>
                )}
              </div>

              <aside className="hidden space-y-5 xl:block">
                <div className="sticky top-6 space-y-5">
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                      {t.today}
                    </p>
                    <div className="mt-5 space-y-4">
                      <MiniStat label={t.appointmentsToday} value={appointmentsToday} />
                      <MiniStat label={t.tasksDue} value="0" />
                      <MiniStat label={t.hotLeads} value={hotLeads} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                      {t.quickActions}
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                      <button onClick={() => setShowLeadModal(true)} className="h-14 rounded-2xl bg-orange-600 px-5 font-bold">
                        {t.newLead}
                      </button>
                      <button onClick={() => setActiveTab("appointments")} className="h-14 rounded-2xl bg-blue-600 px-5 font-bold">
                        {t.newAppointment}
                      </button>
                      <button onClick={generateAI} className="h-14 rounded-2xl bg-purple-600 px-5 font-bold">
                        {t.generateAI}
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <h2 className="text-3xl font-black">{t.newLeadTitle}</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl bg-black p-4"
                placeholder="name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              />

              <input
                className="rounded-xl bg-black p-4"
                placeholder="phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              />

              <input
                className="rounded-xl bg-black p-4"
                placeholder="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              />

              <input
                className="rounded-xl bg-black p-4"
                placeholder="source"
                value={newLead.source}
                onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
              />

              <input
                className="rounded-xl bg-black p-4"
                placeholder="product"
                value={newLead.product}
                onChange={(e) => setNewLead({ ...newLead, product: e.target.value })}
              />

              <select
                className="rounded-xl bg-black p-4"
                value={newLead.language}
                onChange={(e) => setNewLead({ ...newLead, language: e.target.value })}
              >
                <option>English</option>
                <option>Spanish</option>
              </select>

              <textarea
                className="min-h-32 rounded-xl bg-black p-4 md:col-span-2"
                placeholder={t.notes}
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={addLead} disabled={loading} className="rounded-2xl bg-orange-600 px-6 py-4 font-bold">
                {t.saveLead}
              </button>
              <button onClick={() => setShowLeadModal(false)} className="rounded-2xl bg-zinc-800 px-6 py-4 font-bold">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function LeadDetails({
  lead,
  detailTab,
  setDetailTab,
  nextBestAction,
  coachText,
  runLeadAction,
  copyDraft,
  openSms,
  openEmail,
  loading,
  loadData,
  t,
}: any) {
  if (!lead) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <p className="text-zinc-400">{t.selectLead}</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
      <div className="grid gap-6 md:grid-cols-[1fr_220px]">
        <div>
          <h2 className="text-4xl font-black">{lead.name || t.unnamedLead}</h2>

          <div className="mt-4 grid gap-3 text-zinc-400 md:grid-cols-2">
            <p>{t.phone}: {lead.phone || t.noPhone}</p>
            <p>{t.email}: {lead.email || t.noEmail}</p>
            <p>{t.stage}: {lead.stage || "new"}</p>
            <p>{t.aiScore}: {lead.ai_score || 0}</p>
          </div>

          <LeadTags leadId={lead.id} initialTags={lead.tags || []} onSaved={loadData} />

          <div className="mt-4 rounded-2xl border border-yellow-800 bg-yellow-950/20 p-5">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
              {t.nextBestAction}
            </p>
            <p className="mt-3 text-zinc-200">
              {nextBestAction?.recommendation || t.generateNext}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <TabButton label={t.aiCoach} active={detailTab === "coach"} onClick={() => setDetailTab("coach")} />
            <TabButton label={t.followUp} active={detailTab === "followup"} onClick={() => setDetailTab("followup")} />
            <TabButton label={t.timeline} active={detailTab === "timeline"} onClick={() => setDetailTab("timeline")} />
            <TabButton label={t.notesTab} active={detailTab === "notes"} onClick={() => setDetailTab("notes")} />
          </div>

          <div className="mt-3 rounded-2xl border border-zinc-800 bg-black p-5">
            {detailTab === "coach" && (
              <>
                <p className="font-bold text-blue-300">{t.aiCoach}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                  {coachText}
                </p>
              </>
            )}

            {detailTab === "followup" && (
              <>
                <p className="font-bold text-green-300">{t.followUpDraft}</p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {lead.follow_up_message || lead.sms_draft || t.noDraft}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={copyDraft} className="rounded-xl bg-zinc-800 px-4 py-3 font-bold">
                    {t.copyDraft}
                  </button>
                  <button onClick={openSms} className="rounded-xl bg-blue-600 px-4 py-3 font-bold">
                    {t.openSms}
                  </button>
                  <button onClick={openEmail} className="rounded-xl bg-purple-600 px-4 py-3 font-bold">
                    {t.openEmail}
                  </button>
                </div>
              </>
            )}

            {detailTab === "timeline" && <LeadTimeline leadId={lead.id} />}

            {detailTab === "notes" && <LeadNotes leadId={lead.id} />}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => runLeadAction("/api/generate-lead-follow-up")}
            disabled={loading}
            className="rounded-2xl bg-orange-600 px-5 py-4 font-bold"
          >
            {t.generateFollowUp}
          </button>

          <button
            onClick={() => runLeadAction("/api/send-lead-sms")}
            disabled={loading}
            className="rounded-2xl bg-green-600 px-5 py-4 font-bold"
          >
            {t.sendMessage}
          </button>
        </div>
      </div>
    </section>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-3 font-bold ${
        active ? "bg-orange-600" : "bg-zinc-800"
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <div className={`rounded-3xl border border-t-4 border-zinc-800 ${color} bg-black p-6 shadow-xl transition hover:border-orange-500`}>
      <p className="text-sm uppercase text-zinc-500">{label}</p>
      <h3 className="mt-3 text-5xl font-black">{value}</h3>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}