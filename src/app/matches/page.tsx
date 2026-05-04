"use client";

import { AppShell } from "../components/layout/AppShell";
import { AppHeader } from "../components/layout/AppHeader";
import { MatchCard } from "../components/tournament/MatchCard";
import { useTournamentStore } from "../lib/store/tournament-store";

export default function MatchesPage() {
  const matches = useTournamentStore((state) => state.matches);

  return (
    <AppShell>
      <AppHeader title="Partite" subtitle="Live, prossime e terminate" live />

      <section className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="rounded-full bg-[#062B55] px-4 py-2 text-sm font-bold text-white shadow-sm">
            Tutte
          </button>

          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#062B55]">
            Live
          </button>

          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#062B55]">
            Campo 1
          </button>

          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#062B55]">
            Campo 2
          </button>
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}