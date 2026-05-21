"use client";

import { useState } from "react";
import EditablePromptBox from "./editable-prompt-box";
import ExportProjectButtons from "./export-project-buttons";
import DeleteProjectButton from "./delete-project-button";
import ProjectCopyButtons from "./project-copy-buttons";
import RegenerateProjectButton from "./regenerate-project-button";
import DuplicateProjectButton from "./duplicate-project-button";

export default function ProjectWorkspaceTabs({
  project,
}: {
  project: any;
}) {
  const [tab, setTab] = useState("prompt");

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setTab("prompt")}
          className={`rounded-xl px-5 py-3 font-bold ${
            tab === "prompt" ? "bg-blue-600" : "bg-zinc-800"
          }`}
        >
          Prompt
        </button>

        <button
          onClick={() => setTab("blueprint")}
          className={`rounded-xl px-5 py-3 font-bold ${
            tab === "blueprint" ? "bg-blue-600" : "bg-zinc-800"
          }`}
        >
          Blueprint
        </button>

        <button
          onClick={() => setTab("export")}
          className={`rounded-xl px-5 py-3 font-bold ${
            tab === "export" ? "bg-blue-600" : "bg-zinc-800"
          }`}
        >
          Export
        </button>

        <button
          onClick={() => setTab("danger")}
          className={`rounded-xl px-5 py-3 font-bold ${
            tab === "danger" ? "bg-red-600" : "bg-zinc-800"
          }`}
        >
          Danger Zone
        </button>
      </div>

      {tab === "prompt" && (
        <div>
          <EditablePromptBox
            id={project.id}
            currentPrompt={project.prompt}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <RegenerateProjectButton
              id={project.id}
              prompt={project.prompt}
            />

            <DuplicateProjectButton id={project.id} />

            <ProjectCopyButtons
              prompt={project.prompt}
              result={project.result}
            />
          </div>
        </div>
      )}

      {tab === "blueprint" && (
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-400">
            AI Output
          </p>

          <h2 className="mb-4 text-2xl font-black">
            Generated App Blueprint
          </h2>

          <pre className="max-h-[760px] overflow-auto whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-black p-5 text-sm leading-6 text-zinc-300">
            {project.result}
          </pre>
        </div>
      )}

      {tab === "export" && (
        <ExportProjectButtons
          title={project.title}
          prompt={project.prompt}
          result={project.result}
        />
      )}

      {tab === "danger" && (
        <div className="rounded-2xl border border-red-800 bg-red-950/30 p-5">
          <h2 className="text-2xl font-black text-red-300">
            Danger Zone
          </h2>

          <p className="mt-2 text-red-200">
            Delete this project only if you do not need it anymore.
          </p>

          <div className="mt-5">
            <DeleteProjectButton id={project.id} />
          </div>
        </div>
      )}
    </div>
  );
}