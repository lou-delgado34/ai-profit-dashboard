import { createClient } from "@supabase/supabase-js";
import TeamClient from "./team-client";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function TeamPage() {
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#05070d] p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-blue-800 bg-blue-950/20 p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-300">
            Team Avengers
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Team Management Center
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-300">
            Add leaders, agents, viewers, and team members.
          </p>
        </section>

        <TeamClient members={members || []} />
      </div>
    </main>
  );
}