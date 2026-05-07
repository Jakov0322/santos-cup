"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/app/components/layout/AppShell";
import { LivePulse } from "@/app/components/ui/LivePulse";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { getMatchById, getMatchEvents } from "@/app/lib/api";
import { Match, MatchEvent } from "@/app/types/database";

export default function MatchDetailsPage() {
  const params = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    const id = params.id as string;

    Promise.all([getMatchById(id), getMatchEvents(id)])
      .then(([m, e]) => {
        setMatch(m);
        setEvents(e);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <AppShell>
        <LoadingSpinner />
      </AppShell>
    );
  }

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

  const homeName = match.home_team?.name ?? "TBD";
  const awayName = match.away_team?.name ?? "TBD";

  const phaseLabel =
    match.phase === "group"
      ? `Girone ${match.group_name}`
      : match.phase === "quarter"
        ? "Quarti di finale"
        : match.phase === "semi"
          ? "Semifinale"
          : "Finale";

  const timeLabel = new Date(match.starts_at).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const goals = events.filter((e) => e.event_type === "goal");
  const cards = events.filter(
    (e) => e.event_type === "yellow_card" || e.event_type === "red_card"
  );

  return (
    <AppShell>
      <section className="space-y-5 pt-5">
        <a href="/matches" className="text-sm font-bold text-[#00C8E8]">
          ← Torna alle partite
        </a>

        <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062B55] to-[#031A33] p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-200">{phaseLabel}</p>
              <p className="mt-1 text-sm text-cyan-200">
                {timeLabel} · Campo {match.field_number}
              </p>
            </div>

            {match.status === "live" && (
              <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <LivePulse />
              </div>
            )}

            {match.status === "finished" && (
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                FT
              </span>
            )}
          </div>

          <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-black">{homeName}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-4 text-5xl font-black">
                <span>{match.status === "scheduled" ? "-" : match.home_score}</span>
                <span className="text-cyan-300">:</span>
                <span>{match.status === "scheduled" ? "-" : match.away_score}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-black">{awayName}</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        {goals.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-[#062B55]">Gol</h2>
            <div className="mt-4 space-y-3">
              {goals.map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-[#062B55]">
                    {event.minute ?? "-"}'
                  </span>
                  <div>
                    <p className="font-bold text-[#062B55]">
                      ⚽ {event.player?.first_name} {event.player?.last_name}
                    </p>
                    <p className="text-xs text-slate-500">{event.team?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards */}
        {cards.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-[#062B55]">Cartellini</h2>
            <div className="mt-4 space-y-3">
              {cards.map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-[#062B55]">
                    {event.minute ?? "-"}'
                  </span>
                  <div>
                    <p className="font-bold text-[#062B55]">
                      {event.event_type === "yellow_card" ? "🟨" : "🟥"}{" "}
                      {event.player?.first_name} {event.player?.last_name}
                    </p>
                    <p className="text-xs text-slate-500">{event.team?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h2 className="text-2xl font-black text-[#062B55]">Timeline</h2>
          <p className="mt-1 text-sm text-slate-500">Tutti gli eventi della partita</p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-3xl">⚽</p>
            <p className="mt-3 font-black text-[#062B55]">
              {match.status === "scheduled"
                ? "La partita non è ancora iniziata"
                : "Nessun evento registrato"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 py-3 text-sm font-black text-[#062B55]">
                  {event.minute ?? "-"}'
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {event.event_type === "goal"
                        ? "⚽"
                        : event.event_type === "assist"
                          ? "👟"
                          : event.event_type === "yellow_card"
                            ? "🟨"
                            : event.event_type === "red_card"
                              ? "🟥"
                              : "⭐"}
                    </span>
                    <div>
                      <p className="font-bold text-[#062B55]">
                        {event.player?.first_name} {event.player?.last_name}
                      </p>
                      <p className="text-sm text-slate-500">{event.team?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}