"use client";

import { useState } from "react";

export default function TasksClient({ tasks }: { tasks: any[] }) {
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  function toggleTask(taskId: string) {
    setOpenTaskId(openTaskId === taskId ? null : taskId);
  }

  return (
    <section className="mt-8 space-y-4">
      {tasks.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
          No delegated tasks yet.
        </div>
      ) : (
        tasks.map((task) => {
          const isOpen = openTaskId === task.id;

          return (
            <div
              key={task.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="w-full text-left"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase text-green-400">
                      {task.agent_name} • {task.agent_role}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {task.task_title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                      {task.task_description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-950 px-4 py-2 text-sm font-bold text-green-300">
                      {task.status}
                    </span>

                    <span className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-bold">
                      {isOpen ? "Close" : "Open"}
                    </span>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-5">
                  <p className="text-sm font-bold uppercase text-zinc-500">
                    Task Description
                  </p>

                  <p className="mt-3 leading-7 text-zinc-300">
                    {task.task_description}
                  </p>

                  <p className="mt-6 text-sm font-bold uppercase text-zinc-500">
                    Agent Output
                  </p>

                  <pre className="mt-3 max-h-[450px] overflow-auto whitespace-pre-wrap rounded-2xl bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">
                    {task.output}
                  </pre>
                </div>
              )}
            </div>
          );
        })
      )}
    </section>
  );
}