"use client";

import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { MatchCard } from "./components/tournament/MatchCard";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { getMatches, applyAutoStatus } from "./lib/api";
import { useFavourites } from "./lib/hooks/useFavourites";
import { Match } from "./types/database";

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { favouriteTeams, hasFavourites } = useFavourites();

  useEffect(() => {
    getMatches()
      .then((m) => setMatches(applyAutoStatus(m)))
      .finally(() => setLoading(false));
  }, []);

  const liveMatches = matches.filter((m) => m.status === "live");
  const nextMatches = matches
    .filter((m) => m.status === "scheduled")
    .slice(0, 4);

  const favMatches = hasFavourites
    ? matches.filter(
        (m) =>
          m.status !== "finished" &&
          (favouriteTeams.includes(m.home_team_id ?? "") ||
            favouriteTeams.includes(m.away_team_id ?? ""))
      )
    : [];

  return (
    <AppShell>
      <section className="space-y-5 pt-6">
        {/* Hero */}
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062B55] to-[#031A33] p-6 text-white shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-cyan-200">
                Official Tournament App
              </p>
              <h1 className="mt-2 text-5xl font-black tracking-tight">
                Santos Cup
              </h1>
              <p className="mt-4 max-w-[220px] text-sm leading-6 text-cyan-100">
                Torneo di calcio a 8 · 12 squadre · 2 gironi
              </p>
            </div>
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/10 text-4xl font-black backdrop-blur">
              ⚽
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Live matches */}
            {liveMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-[#062B55]">🔴 Live</h2>
                <div className="mt-3 space-y-3">
                  {liveMatches.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            )}

            {/* Favourite teams matches */}
            {favMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-[#062B55]">
                  ❤️ Le tue squadre
                </h2>
                <div className="mt-3 space-y-3">
                  {favMatches.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            )}

            {/* Next matches */}
            {nextMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-[#062B55]">
                  Prossime partite
                </h2>
                <div className="mt-3 space-y-3">
                  {nextMatches.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            )}

            {/* Fallback when nothing live */}
            {liveMatches.length === 0 && nextMatches.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-3xl">📅</p>
                <p className="mt-3 font-black text-[#062B55]">
                  Nessuna partita in programma
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </AppShell>
  );
}