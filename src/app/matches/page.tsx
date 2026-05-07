"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { AppHeader } from "../components/layout/AppHeader";
import { MatchCard } from "../components/tournament/MatchCard";
import { getMatches, applyAutoStatus } from "../lib/api";
import { Match } from "../types/database";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

type Filter = "all" | "live" | "scheduled" | "finished";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    getMatches()
      .then((m) => setMatches(applyAutoStatus(m)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = matches.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  const hasLive = matches.some((m) => m.status === "live");

  return (
    <AppShell>
      <AppHeader title="Partite" subtitle="Live, prossime e terminate" live={hasLive} />

      <section className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {([
            { key: "all", label: "Tutte" },
            { key: "live", label: "Live" },
            { key: "scheduled", label: "Prossime" },
            { key: "finished", label: "Finite" },
          ] as { key: Filter; label: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm transition ${
                filter === f.key
                  ? "bg-[#062B55] text-white"
                  : "border border-slate-200 bg-white text-[#062B55]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-slate-500">Nessuna partita trovata</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}