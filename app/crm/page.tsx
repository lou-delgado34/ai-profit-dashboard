"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import LeadTimeline from "../components/crm/LeadTimeline";
import LeadNotes from "../components/crm/LeadNotes";
import LeadTags from "../components/crm/LeadTags";
import PipelineBoard from "../components/crm/PipelineBoard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CrmPage() {
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
    language: "English",
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
      alert(data.error || "Could not add lead.");
      return;
    }

    setShowLeadModal(false);
    setNewLead({
      name: "",
      phone: "",
      email: "",
      language: "English",
      source: "manual",
      product: "Term life insurance",
      notes: "",
    });

    await loadData();
  }

  async function runLeadAction(endpoint: string) {
    if (!selectedLead) {
      alert("Select a lead first.");
      return;
    }

    setLoading(true);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: selectedLead.id }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Action failed.");
      return;
    }

    await loadData();
  }

  async function generateAI() {
    if (!selectedLead) {
      alert("Select a lead first.");
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
      "No draft available.";

    navigator.clipboard.writeText(draft);
    alert("Draft copied.");
  }

  function openSms() {
    if (!selectedLead?.phone) {
      alert("Lead has no phone number.");
      return;
    }

    const message =
      selectedLead?.sms_draft ||
      selectedLead?.follow_up_message ||
      "Hi, just following up with you.";

    window.location.href = `sms:${selectedLead.phone}?body=${encodeURIComponent(message)}`;
  }

  function openEmail() {
    if (!selectedLead?.email) {
      alert("Lead has no email.");
      return;
    }

    const subject = "Quick follow-up";
    const body =
      selectedLead?.email_draft ||
      selectedLead?.follow_up_message ||
      "Hi, just following up with you.";

    window.location.href = `mailto:${selectedLead.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  const coachText =
    salesCoach?.recommendation ||
    "• Thank the lead\n• Explain term life simply\n• Ask questions\n• Schedule appointment";

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="flex max-w-full overflow-hidden">
        <aside className="hidden min-h-screen w-[220px] shrink-0 border-r border-zinc-800 bg-zinc-950 p-5 md:block">
          <h1 className="text-2xl font-black">Team Avengers</h1>
          <p className="mt-1 text-sm text-zinc-500">CRM Command Center</p>

          <nav className="mt-10 space-y-3">
            {[
              ["dashboard", "🏠 Dashboard"],
              ["leads", "👥 Leads"],
              ["appointments", "📅 Appointments"],
              ["ai", "🤖 AI Coach"],
              ["reports", "📈 Reports"],
              ["settings", "⚙️ Settings"],
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
                  Team Avengers CRM
                </p>
                <h2 className="mt-2 text-4xl font-black">Lead Command Center</h2>
                <p className="mt-2 text-zinc-400">
                  Manage leads, appointments, AI coaching and follow-ups.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowLeadModal(true)}
                  className="rounded-2xl bg-orange-600 px-5 py-3 font-bold"
                >
                  + New Lead
                </button>

                <button
                  onClick={() => setActiveTab("appointments")}
                  className="rounded-2xl bg-blue-600 px-5 py-3 font-bold"
                >
                  + New Appointment
                </button>

                <button
                  onClick={generateAI}
                  disabled={loading}
                  className="rounded-2xl bg-purple-600 px-5 py-3 font-bold disabled:opacity-50"
                >
                  Generate AI
                </button>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 space-y-6">
                <section className="grid gap-4 md:grid-cols-4">
                  <StatCard label="Total Leads" value={leads.length} color="border-orange-500" />
                  <StatCard label="Appointments Set" value={appointments.length} color="border-blue-500" />
                  <StatCard label="Hot Leads" value={hotLeads} color="border-green-500" />
                  <StatCard label="Conversion %" value={`${conversion}%`} color="border-purple-500" />
                </section>

                <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl">
                  <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
                    Search Leads
                  </p>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, phone, or email"
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
                    />
                  </>
                )}

                {activeTab === "appointments" && (
                  <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <h2 className="text-3xl font-black">Appointments</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {appointments.map((appt) => (
                        <div key={appt.id} className="rounded-2xl border border-zinc-800 bg-black p-5">
                          <p className="text-xl font-black">{appt.title || "Term Life Consultation"}</p>
                          <p className="mt-2 text-zinc-400">Lead: {appt.crm_leads?.name || "Unknown"}</p>
                          <p className="mt-2 text-blue-400">
                            {appt.appointment_date
                              ? new Date(appt.appointment_date).toLocaleString()
                              : "No date"}
                          </p>
                          <p className="mt-2 text-sm text-zinc-500">Status: {appt.status}</p>
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
                  />
                )}

                {activeTab === "reports" && (
                  <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <h2 className="text-3xl font-black">Reports</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <StatCard label="Total Leads" value={leads.length} color="border-orange-500" />
                      <StatCard label="Appointments" value={appointments.length} color="border-blue-500" />
                      <StatCard label="Conversion %" value={`${conversion}%`} color="border-purple-500" />
                      <StatCard label="Top Producer" value="Lou" color="border-green-500" />
                    </div>
                  </section>
                )}

                {activeTab === "settings" && (
                  <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <h2 className="text-3xl font-black">CRM Settings</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <input className="rounded-xl bg-black p-4" defaultValue="Team Avengers" />
                      <select className="rounded-xl bg-black p-4" defaultValue="English">
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
                      Save Settings
                    </button>
                  </section>
                )}
              </div>

              <aside className="hidden space-y-5 xl:block">
                <div className="sticky top-6 space-y-5">
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                      Today
                    </p>
                    <div className="mt-5 space-y-4">
                      <MiniStat label="Appointments Today" value={appointmentsToday} />
                      <MiniStat label="Tasks Due" value="0" />
                      <MiniStat label="Hot Leads" value={hotLeads} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                      Quick Actions
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                      <button onClick={() => setShowLeadModal(true)} className="h-14 rounded-2xl bg-orange-600 px-5 font-bold">
                        + New Lead
                      </button>
                      <button onClick={() => setActiveTab("appointments")} className="h-14 rounded-2xl bg-blue-600 px-5 font-bold">
                        + New Appointment
                      </button>
                      <button onClick={generateAI} className="h-14 rounded-2xl bg-purple-600 px-5 font-bold">
                        Generate AI
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
            <h2 className="text-3xl font-black">New Lead</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {["name", "phone", "email", "source", "product"].map((field) => (
                <input
                  key={field}
                  className="rounded-xl bg-black p-4"
                  placeholder={field}
                  value={(newLead as any)[field]}
                  onChange={(e) => setNewLead({ ...newLead, [field]: e.target.value })}
                />
              ))}

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
                placeholder="Notes"
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={addLead} disabled={loading} className="rounded-2xl bg-orange-600 px-6 py-4 font-bold">
                Save Lead
              </button>
              <button onClick={() => setShowLeadModal(false)} className="rounded-2xl bg-zinc-800 px-6 py-4 font-bold">
                Cancel
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
}: any) {
  if (!lead) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <p className="text-zinc-400">Select a lead to view details.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
      <div className="grid gap-6 md:grid-cols-[1fr_220px]">
        <div>
          <h2 className="text-4xl font-black">{lead.name || "Unnamed Lead"}</h2>

          <div className="mt-4 grid gap-3 text-zinc-400 md:grid-cols-2">
            <p>Phone: {lead.phone || "No phone"}</p>
            <p>Email: {lead.email || "No email"}</p>
            <p>Stage: {lead.stage || "new"}</p>
            <p>AI Score: {lead.ai_score || 0}</p>
          </div>

          <LeadTags leadId={lead.id} initialTags={lead.tags || []} onSaved={loadData} />

          <div className="mt-4 rounded-2xl border border-yellow-800 bg-yellow-950/20 p-5">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
              Next Best Action
            </p>
            <p className="mt-3 text-zinc-200">
              {nextBestAction?.recommendation || "Generate AI to get the next best action."}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <TabButton label="AI Coach" active={detailTab === "coach"} onClick={() => setDetailTab("coach")} />
            <TabButton label="Follow Up" active={detailTab === "followup"} onClick={() => setDetailTab("followup")} />
            <TabButton label="Timeline" active={detailTab === "timeline"} onClick={() => setDetailTab("timeline")} />
            <TabButton label="Notes" active={detailTab === "notes"} onClick={() => setDetailTab("notes")} />
          </div>

          <div className="mt-3 rounded-2xl border border-zinc-800 bg-black p-5">
            {detailTab === "coach" && (
              <>
                <p className="font-bold text-blue-300">AI Coach</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                  {coachText}
                </p>
              </>
            )}

            {detailTab === "followup" && (
              <>
                <p className="font-bold text-green-300">Follow-Up Draft</p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {lead.follow_up_message || lead.sms_draft || "No draft yet."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={copyDraft} className="rounded-xl bg-zinc-800 px-4 py-3 font-bold">
                    Copy Draft
                  </button>
                  <button onClick={openSms} className="rounded-xl bg-blue-600 px-4 py-3 font-bold">
                    Open SMS
                  </button>
                  <button onClick={openEmail} className="rounded-xl bg-purple-600 px-4 py-3 font-bold">
                    Open Email
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
            Generate Follow Up
          </button>

          <button
            onClick={() => runLeadAction("/api/send-lead-sms")}
            disabled={loading}
            className="rounded-2xl bg-green-600 px-5 py-4 font-bold"
          >
            Send Message
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