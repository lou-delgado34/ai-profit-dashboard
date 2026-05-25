"use client";

import { useState } from "react";
import GenerateBuildPackButton from "./generate-build-pack-button";
import GenerateProjectFilesButton from "./generate-project-files-button";
import BuildPackViewer from "./build-pack-viewer";
import GeneratedFilesViewer from "./generated-files-viewer";
import ProjectExportPackage from "./project-export-package";
import ProjectLaunchChecklist from "./project-launch-checklist";
import ProductionReadinessPanel from "./production-readiness-panel";
import StartRealBuildButton from "./start-real-build-button";
import RealBuildStatusPanel from "./real-build-status-panel";
import AdminBuildControls from "./admin-build-controls";

export default function ProjectWorkspaceTabsV2({
  project,
  buildJob,
}: {
  project: any;
  buildJob?: any;
}) {
  const [tab, setTab] = useState("overview");

  const buildPack = project.build_pack || {};
  const generatedFiles = project.generated_files || {};

  const tabs = [
    "overview",
    "build pack",
    "files",
    "export",
    "launch",
    "readiness",
    "real build",
    "admin",
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex flex-wrap gap-3">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-xl px-5 py-3 font-bold capitalize ${
                tab === item
                  ? "bg-blue-600 text-white"
                  : "bg-black text-zinc-400 hover:bg-zinc-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
            Project Overview
          </p>

          <h2 className="mt-2 text-4xl font-black">
            {project.title || "Untitled Project"}
          </h2>

          <p className="mt-2 text-sm font-bold uppercase text-green-400">
            App Type: {project.app_type || "Custom SaaS App"}
          </p>

          <p className="mt-4 whitespace-pre-wrap text-zinc-400">
            {project.prompt}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <GenerateBuildPackButton projectId={project.id} prompt={project.prompt} />

            <GenerateProjectFilesButton
              projectId={project.id}
              prompt={project.prompt}
              buildPack={buildPack}
            />

            <StartRealBuildButton projectId={project.id} />
          </div>
        </section>
      )}

      {tab === "build pack" && <BuildPackViewer buildPack={buildPack} />}
      {tab === "files" && <GeneratedFilesViewer generatedFiles={generatedFiles} />}
      {tab === "export" && <ProjectExportPackage project={project} />}
      {tab === "launch" && <ProjectLaunchChecklist generatedFiles={generatedFiles} />}
      {tab === "readiness" && <ProductionReadinessPanel project={project} />}

      {tab === "real build" && (
        <RealBuildStatusPanel project={project} buildJob={buildJob || null} />
      )}

      {tab === "admin" && <AdminBuildControls projectId={project.id} />}
    </div>
  );
}