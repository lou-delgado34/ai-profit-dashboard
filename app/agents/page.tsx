import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <h1 className="text-5xl font-black">AI Superagents</h1>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">
          App Builder
        </Link>

        <Link href="/projects" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">
          Projects
        </Link>

        <Link href="/actions" className="rounded-xl bg-green-600 px-5 py-3 font-bold">
          Action Queue
        </Link>
      </div>

      <p className="mt-8 text-zinc-400">
        Agents route is now live.
      </p>
    </main>
  );
}
