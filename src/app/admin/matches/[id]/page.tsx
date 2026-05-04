"use client";

import { useParams } from "next/navigation";

import { AppShell } from "@/app/components/layout/AppShell";

import { AdminMatchEventForm } from "@/app/components/admin/AdminMatchEventForm";

import { MatchEventItem } from "@/app/components/tournament/MatchEventItem";

import { useTournamentStore } from "@/app/lib/store/tournament-store";

import { useEventStore } from "@/app/lib/store/event-store";

export default function AdminMatchDetailsPage() {
  const params = useParams();

  const matches = useTournamentStore(
    (state) => state.matches
  );

  const match = matches.find(
    (m) => m.id === params.id
  );

  const getMatchEvents =
    useEventStore(
      (state) =>
        state.getMatchEvents
    );

  if (!match) {
    return (
      <AppShell showBottomNav={false}>
        Match non trovato
      </AppShell>
    );
  }

  const events = getMatchEvents(
    match.id
  );

  return (
    <AppShell showBottomNav={false}>
      <section className="space-y-5 pt-5">
        <div>
          <a
            href="/admin/matches"
            className="text-sm font-bold text-[#00C8E8]"
          >
            ← Torna partite
          </a>

          <h1 className="mt-3 text-3xl font-black text-[#062B55]">
            Gestione eventi
          </h1>

          <p className="mt-1 text-slate-500">
            {match.homeTeam} vs{" "}
            {match.awayTeam}
          </p>
        </div>

        <AdminMatchEventForm
          matchId={match.id}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
        />

        <div>
          <h2 className="text-2xl font-black text-[#062B55]">
            Timeline live
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Eventi inseriti
          </p>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <MatchEventItem
              key={event.id}
              event={event}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}