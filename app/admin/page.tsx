import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdminTeamForm from "./team-form";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">Home</Link>
          <Link href="/crm" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">CRM</Link>
          <Link href="/team" className="rounded-xl bg-green-600 px-5 py-3 font-bold">Team</Link>
          <Link href="/admin" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Admin</Link>
        </nav>

        <section className="rounded-3xl border border-purple-800 bg-purple-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-300">
            Admin Control Center
          </p>

          <h1 className="mt-3 text-5xl font-black">Admin Dashboard</h1>

          <p className="mt-4 text-zinc-300">
            Add advisors, assign roles, set license levels, and control access.
          </p>
        </section>

        <AdminTeamForm />

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Team Members</h2>

          <div className="mt-5 space-y-3">
            {(members || []).length === 0 ? (
              <p className="text-zinc-400">No team members yet.</p>
            ) : (
              (members || []).map((member: any) => (
                <div key={member.id} className="rounded-2xl bg-black p-5">
                  <p className="text-xl font-black">{member.name}</p>

                  <p className="mt-1 text-zinc-400">
                    {member.email || "No email"} • {member.role}
                  </p>

                  <p className="mt-2 text-blue-400">
                    License: {member.license_level}
                  </p>

                  <p className="mt-1 text-green-400">
                    Status: {member.status} • Points: {member.points}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}