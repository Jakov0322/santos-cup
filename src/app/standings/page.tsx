"use client";

import { AppShell } from "../components/layout/AppShell";
import { AppHeader } from "../components/layout/AppHeader";
import { LiveStandingsTable } from "../components/tournament/LiveStandingsTable";

import { useTournamentStore } from "../lib/store/tournament-store";
import { calculateLiveStandings } from "../lib/tournament/standings-engine";

export default function StandingsPage() {
  const matches = useTournamentStore((state) => state.matches);

  const standings = calculateLiveStandings(matches);

  return (
    <AppShell>
      <AppHeader
        title="Classifiche"
        subtitle="Gironi aggiornati in tempo reale"
        live
      />

      <section className="space-y-5">
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-sm font-semibold leading-6 text-[#062B55]">
            La classifica include le partite terminate e, se una partita è live,
            mostra la proiezione come se finisse con il risultato attuale.
          </p>
        </div>

        <LiveStandingsTable
          title="Classifica live"
          rows={standings}
        />
      </section>
    </AppShell>
  );
}