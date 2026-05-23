"use client";

import { useState } from "react";
import GenerateBuildPackButton from "./generate-build-pack-button";
import GenerateProjectFilesButton from "./generate-project-files-button";
import BuildPackViewer from "./build-pack-viewer";
import GeneratedFilesViewer from "./generated-files-viewer";
import ProjectExportPackage from "./project-export-package";
import ProjectLaunchChecklist from "./project-launch-checklist";

export default function ProjectWorkspaceTabsV2({
  project,
}: {
  project: any;
}) {
  const [tab, setTab] = useState("overview");

  const buildPack = project.build_pack || {};
  const generatedFiles = project.generated_files || {};

  const hasBuildPack = Object.keys(buildPack).length > 0;
  const hasFiles = Object.keys(generatedFiles).length > 0;

  const tabs = [
    "overview",
    "build pack",
    "files",
    "export",
    "launch",
    "status",
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

          <p className="mt-4 whitespace-pre-wrap text-zinc-400">
            {project.prompt}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <GenerateBuildPackButton
              projectId={project.id}
              prompt={project.prompt}
            />

            <GenerateProjectFilesButton
              projectId={project.id}
              prompt={project.prompt}
              buildPack={buildPack}
            />
          </div>
        </section>
      )}

      {tab === "build pack" && <BuildPackViewer buildPack={buildPack} />}

      {tab === "files" && (
        <GeneratedFilesViewer generatedFiles={generatedFiles} />
      )}

      {tab === "export" && <ProjectExportPackage project={project} />}

      {tab === "launch" && (
        <ProjectLaunchChecklist generatedFiles={generatedFiles} />
      )}

      {tab === "status" && (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-green-400">
            Build Status
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Project Completion Tracker
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="text-sm font-bold uppercase text-zinc-500">
                Build Pack
              </p>
              <p className="mt-2 text-3xl font-black">
                {hasBuildPack ? "Complete" : "Missing"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="text-sm font-bold uppercase text-zinc-500">
                Code Files
              </p>
              <p className="mt-2 text-3xl font-black">
                {hasFiles ? "Complete" : "Missing"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="text-sm font-bold uppercase text-zinc-500">
                Export Package
              </p>
              <p className="mt-2 text-3xl font-black">
                {hasFiles ? "Ready" : "Waiting"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="text-sm font-bold uppercase text-zinc-500">
                Launch Status
              </p>
              <p className="mt-2 text-3xl font-black">
                {hasBuildPack && hasFiles ? "Ready" : "In Progress"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-800 bg-blue-950/30 p-5">
            <h3 className="text-xl font-black text-blue-300">
              Next Best Step
            </h3>

            <p className="mt-2 text-blue-100">
              {!hasBuildPack
                ? "Generate the Build Pack first."
                : !hasFiles
                ? "Generate Code Files next."
                : "Download the ZIP package and follow the Launch Checklist."}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}