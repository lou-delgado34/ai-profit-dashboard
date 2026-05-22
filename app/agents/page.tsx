import Link from "next/link";

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 font-bold">
            Home
          </Link>

          <Link href="/projects" className="rounded-xl bg-purple-600 px-6 py-3 font-bold">
            Projects
          </Link>

          <Link href="/agents" className="rounded-xl bg-green-600 px-6 py-3 font-bold">
            Agents
          </Link>

          <Link href="/actions" className="rounded-xl bg-pink-600 px-6 py-3 font-bold">
            Actions
          </Link>
        </div>

        <h1 className="text-6xl font-black">AI Superagents</h1>

        <p className="mt-6 text-zinc-400 text-xl">
          Agent management dashboard coming next.
        </p>
      </div>
    </main>
  );
}