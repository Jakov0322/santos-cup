import { AdminTeamCard } from "@/app/components/admin/AdminTeamCard";
import { AppShell } from "@/app/components/layout/AppShell";

import { mockTeams } from "@/app/lib/tournament/mock";

export default function AdminTeamsPage() {
  return (
    <AppShell showBottomNav={false}>
      <section className="space-y-5">
        <div>
          <a
            href="/admin"
            className="text-sm font-bold text-[#00C8E8]"
          >
            ← Torna alla dashboard
          </a>

          <h1 className="mt-3 text-3xl font-black text-[#062B55]">
            Gestione squadre
          </h1>

          <p className="mt-1 text-slate-500">
            Visualizza e modifica le squadre registrate
          </p>
        </div>

        <button className="w-full rounded-3xl bg-[#00C8E8] px-5 py-5 text-lg font-black text-[#031A33]">
          + Aggiungi squadra
        </button>

        <div className="space-y-4">
          {mockTeams.map((team) => (
            <AdminTeamCard
              key={team.id}
              team={team}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}