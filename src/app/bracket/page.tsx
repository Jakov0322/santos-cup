"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { AppHeader } from "../components/layout/AppHeader";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { GroupStandings } from "../components/tournament/GroupStandings";
import { BracketMatchCard } from "../components/tournament/BracketMatchCard";
import { getGroupStandings, getMatchesByPhase } from "../lib/api";
import { StandingRow, Match } from "../types/database";

export default function BracketPage() {
  const [groupA, setGroupA] = useState<StandingRow[]>([]);
  const [groupB, setGroupB] = useState<StandingRow[]>([]);
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getGroupStandings("A"),
      getGroupStandings("B"),
      getMatchesByPhase("quarter"),
      getMatchesByPhase("semi"),
      getMatchesByPhase("final"),
    ])
      .then(([a, b, quarters, semis, finals]) => {
        setGroupA(a);
        setGroupB(b);
        setKnockoutMatches([...quarters, ...semis, ...finals]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell>
        <AppHeader title="Tabellone" subtitle="Gironi e fase finale" />
        <LoadingSpinner />
      </AppShell>
    );
  }

  const quarters = knockoutMatches.filter((m) => m.phase === "quarter");
  const semis = knockoutMatches.filter((m) => m.phase === "semi");
  const finals = knockoutMatches.filter((m) => m.phase === "final");

  return (
    <AppShell>
      <AppHeader title="Tabellone" subtitle="Gironi e fase finale" />

      <section className="space-y-6">
        {/* Group Standings */}
        <GroupStandings groupName="Girone A" rows={groupA} />
        <GroupStandings groupName="Girone B" rows={groupB} />

        {/* Knockout phase info */}
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-sm font-semibold leading-6 text-[#062B55]">
            Le prime 4 di ogni girone accedono ai quarti di finale.
            Gli incroci sono: 1ª Girone A vs 4ª Girone B, 2ª A vs 3ª B,
            1ª B vs 4ª A, 2ª B vs 3ª A.
          </p>
        </div>

        {/* Knockout Matches */}
        {quarters.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-black text-[#062B55]">Quarti di finale</h2>
            {quarters.map((match) => (
              <BracketMatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {semis.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-black text-[#062B55]">Semifinali</h2>
            {semis.map((match) => (
              <BracketMatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {finals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-black text-[#062B55]">Finale</h2>
            {finals.map((match) => (
              <BracketMatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {knockoutMatches.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-3xl">🏆</p>
            <p className="mt-3 font-black text-[#062B55]">
              Fase finale non ancora definita
            </p>
            <p className="mt-1 text-sm text-slate-500">
              I quarti verranno generati al termine della fase a gironi
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}