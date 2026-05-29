import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function TeamPage() {
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("points", { ascending: false });

  const { data: activity } = await supabase
    .from("team_activity")
    .select("*, team_members(name)")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main className="min-h-screen bg-[#05070d] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-bold">Home</Link>
          <Link href="/crm" className="rounded-xl bg-orange-600 px-5 py-3 font-bold">CRM</Link>
          <Link href="/team" className="rounded-xl bg-green-600 px-5 py-3 font-bold">Team</Link>
          <Link href="/admin" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Admin</Link>
        </nav>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-green-400">
            Team Avengers Command Center
          </p>

          <h1 className="mt-3 text-5xl font-black">Team Dashboard</h1>

          <p className="mt-4 text-zinc-400">
            Track advisors, licenses, roles, activity, points, and leaderboard progress.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">Team Members</p>
            <h2 className="mt-2 text-4xl font-black">{(members || []).length}</h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">Life Licensed</p>
            <h2 className="mt-2 text-4xl font-black">
              {(members || []).filter((m: any) => m.license_level === "life_only").length}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">Securities Licensed</p>
            <h2 className="mt-2 text-4xl font-black">
              {(members || []).filter((m: any) => m.license_level === "life_and_securities").length}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase text-zinc-500">Active</p>
            <h2 className="mt-2 text-4xl font-black">
              {(members || []).filter((m: any) => m.status === "active").length}
            </h2>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Leaderboard</h2>

          <div className="mt-5 space-y-3">
            {(members || []).length === 0 ? (
              <p className="text-zinc-400">No team members yet.</p>
            ) : (
              (members || []).map((member: any, index: number) => (
                <div key={member.id} className="rounded-2xl bg-black p-5">
                  <p className="text-xl font-black">
                    #{index + 1} {member.name}
                  </p>

                  <p className="mt-1 text-zinc-400">
                    {member.role} • {member.license_level} • {member.status}
                  </p>

                  <p className="mt-2 font-bold text-green-400">
                    {member.points} points • {member.leads_added} leads • {member.appointments_booked} appointments
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Recent Team Activity</h2>

          <div className="mt-5 space-y-3">
            {(activity || []).length === 0 ? (
              <p className="text-zinc-400">No activity yet.</p>
            ) : (
              (activity || []).map((item: any) => (
                <div key={item.id} className="rounded-2xl bg-black p-4">
                  <p className="font-bold">{item.team_members?.name || "Unknown"}</p>
                  <p className="text-zinc-400">{item.description}</p>
                  <p className="text-sm text-green-400">+{item.points} points</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}