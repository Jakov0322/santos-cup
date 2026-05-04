"use client";

import { useParams } from "next/navigation";

import { AppShell } from "@/app/components/layout/AppShell";
import { MatchEventItem } from "@/app/components/tournament/MatchEventItem";
import { LivePulse } from "@/app/components/ui/LivePulse";

import { useLiveMinute } from "@/app/lib/hooks/useLiveMinute";
import { useTournamentStore } from "@/app/lib/store/tournament-store";
import { useEventStore } from "@/app/lib/store/event-store";

export default function MatchDetailsPage() {
  const params = useParams();

  const matches = useTournamentStore((state) => state.matches);

  const match = matches.find((m) => m.id === params.id);

  const getMatchEvents = useEventStore((state) => state.getMatchEvents);

  const liveMinute = useLiveMinute(14);

  if (!match) {
    return (
      <AppShell>
        <section className="space-y-5 pt-5">
          <a href="/matches" className="text-sm font-bold text-[#00C8E8]">
            ← Torna alle partite
          </a>

          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="font-black text-[#062B55]">Partita non trovata</p>
          </div>
        </section>
      </AppShell>
    );
  }

  const events = getMatchEvents(match.id);

  return (
    <AppShell>
      <section className="space-y-5 pt-5">
        <div>
          <a href="/matches" className="text-sm font-bold text-[#00C8E8]">
            ← Torna alle partite
          </a>
        </div>

        <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062B55] to-[#031A33] p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-200">{match.phase}</p>

              <p className="mt-1 text-sm text-cyan-200">
                Campo {match.field}
              </p>
            </div>

            <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              <LivePulse />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-black">{match.homeTeam}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-4 text-6xl font-black">
                <span>{match.homeScore}</span>
                <span className="text-cyan-300">-</span>
                <span>{match.awayScore}</span>
              </div>

              <p className="mt-4 text-lg font-black text-cyan-200">
                {liveMinute}'
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl font-black">{match.awayTeam}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#062B55]">
              Match Stats
            </h2>

            <LivePulse />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-3xl font-black text-[#062B55]">8</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Tiri</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-3xl font-black text-[#062B55]">61%</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Possesso
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-3xl font-black text-[#062B55]">3</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Falli
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#062B55]">
            Timeline partita
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Eventi live della partita
          </p>
        </div>

        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-3xl">⚽</p>
              <p className="mt-3 font-black text-[#062B55]">
                Nessun evento inserito
              </p>
            </div>
          ) : (
            events.map((event) => (
              <MatchEventItem key={event.id} event={event} />
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}