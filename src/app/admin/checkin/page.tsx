import { AppShell } from "@/app/components/layout/AppShell";
import { PlayerCheckinCard } from "@/app/components/admin/PlayerCheckinCard";

import {
  mockPlayers,
  mockTeams,
} from "@/app/lib/tournament/mock";

export default function AdminCheckinPage() {
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
            Check-in QR
          </h1>

          <p className="mt-1 text-slate-500">
            Gestione ingressi giocatori e squadre
          </p>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-[#00C8E8] bg-cyan-50 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#062B55] text-3xl text-white">
            QR
          </div>

          <h2 className="mt-4 text-xl font-black text-[#062B55]">
            Scanner QR Mock
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            In futuro qui verrà integrato lo scanner QR reale
            tramite fotocamera.
          </p>

          <button className="mt-5 rounded-2xl bg-[#00C8E8] px-5 py-4 font-black text-[#031A33]">
            Simula scansione QR
          </button>
        </div>

        <div className="space-y-4">
          {mockPlayers.map((player) => {
            const team = mockTeams.find(
              (t) => t.id === player.teamId
            );

            return (
              <PlayerCheckinCard
                key={player.id}
                playerName={`${player.firstName} ${player.lastName}`}
                teamName={team?.name || "Unknown"}
                shirtNumber={player.shirtNumber}
                initialCheckedIn={player.checkedIn}
              />
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}