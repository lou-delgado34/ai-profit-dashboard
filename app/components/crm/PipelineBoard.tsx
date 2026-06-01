"use client";

import { useState } from "react";

const stages = ["new", "warm", "appointment_ready", "needs_follow_up", "not_ready"];

const stageLabels: Record<string, string> = {
  new: "New",
  warm: "Warm",
  appointment_ready: "Appointment Ready",
  needs_follow_up: "Needs Follow Up",
  not_ready: "Not Ready",
};

export default function PipelineBoard({
  leads,
  selectedLead,
  setSelectedLead,
  onStageUpdated,
}: {
  leads: any[];
  selectedLead: any;
  setSelectedLead: (lead: any) => void;
  onStageUpdated?: () => void;
}) {
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);

  async function moveLead(leadId: string, stage: string) {
    setLoadingStage(stage);

    const res = await fetch("/api/update-lead-stage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadId,
        stage,
      }),
    });

    setLoadingStage(null);
    setDraggingLeadId(null);

    if (!res.ok) {
      alert("Could not move lead.");
      return;
    }

    if (onStageUpdated) {
      onStageUpdated();
    }
  }

  return (
    <section className="max-w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black">Lead Pipeline</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Drag leads between stages or click a lead to view details.
          </p>
        </div>

        {draggingLeadId && (
          <div className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold">
            Moving lead...
          </div>
        )}
      </div>

      <div className="mt-5 max-w-full overflow-x-auto pb-4">
        <div className="flex w-max gap-6">
          {stages.map((stage) => {
            const stageLeads = leads.filter((lead) => lead.stage === stage);

            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const leadId = e.dataTransfer.getData("leadId");

                  if (leadId) {
                    moveLead(leadId, stage);
                  }
                }}
                className="h-[420px] w-[280px] overflow-y-auto rounded-3xl border border-zinc-800 bg-black p-4 transition hover:border-orange-500"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-blue-400">
                    {stageLabels[stage] || stage}
                  </h3>

                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-400">
                    {stageLeads.length}
                  </span>
                </div>

                {loadingStage === stage && (
                  <div className="mb-3 rounded-xl bg-orange-950 p-3 text-sm font-bold text-orange-300">
                    Updating...
                  </div>
                )}

                <div className="space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-800 p-4 text-sm text-zinc-600">
                      Drop lead here
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const active = selectedLead?.id === lead.id;

                      return (
                        <button
                          key={lead.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggingLeadId(lead.id);
                            e.dataTransfer.setData("leadId", lead.id);
                          }}
                          onDragEnd={() => setDraggingLeadId(null)}
                          onClick={() => setSelectedLead(lead)}
                          className={`w-full cursor-grab rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] hover:border-orange-500 active:cursor-grabbing ${
                            active
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-zinc-800 bg-zinc-950"
                          }`}
                        >
                          <p className="font-black">
                            {lead.name || "Unnamed Lead"}
                          </p>

                          <p className="mt-1 text-sm text-zinc-400">
                            {lead.phone || "No phone"}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-sm font-bold text-green-400">
                              Score: {lead.ai_score || 0}
                            </p>

                            {(lead.tags || []).length > 0 && (
                              <span className="rounded-full bg-purple-950 px-2 py-1 text-[10px] font-bold text-purple-300">
                                {(lead.tags || [])[0]}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}