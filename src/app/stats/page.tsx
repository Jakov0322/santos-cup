"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { AppHeader } from "../components/layout/AppHeader";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { getTopScorers, getTopAssists, getTopMVP } from "../lib/api";
import { PlayerStats } from "../types/database";

type StatsTab = "marcatori" | "assist" | "mvp";

export default function StatsPage() {
  const [scorers, setScorers] = useState<PlayerStats[]>([]);
  const [assists, setAssists] = useState<PlayerStats[]>([]);
  const [mvps, setMvps] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<StatsTab>("marcatori");

  useEffect(() => {
    Promise.all([getTopScorers(), getTopAssists(), getTopMVP()])
      .then(([s, a, m]) => {
        setScorers(s);
        setAssists(a);
        setMvps(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: StatsTab; label: string }[] = [
    { key: "marcatori", label: "Marcatori" },
    { key: "assist", label: "Assistmen" },
    { key: "mvp", label: "MVP" },
  ];

  const currentData =
    tab === "marcatori" ? scorers : tab === "assist" ? assists : mvps;

  const statLabel = tab === "marcatori" ? "Gol" : tab === "assist" ? "Assist" : "MVP";
  const getStatValue = (s: PlayerStats) =>
    tab === "marcatori" ? s.goals : tab === "assist" ? s.assists : s.mvp_awards;

  return (
    <AppShell>
      <AppHeader title="Statistiche" subtitle="Classifiche individuali del torneo" />

      <section className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                tab === t.key
                  ? "bg-[#062B55] text-white"
                  : "border border-slate-200 bg-white text-[#062B55]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : currentData.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-3xl">📊</p>
            <p className="mt-3 font-black text-[#062B55]">
              Nessuna statistica disponibile
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentData.map((stat, index) => (
              <div
                key={stat.player.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#062B55] font-black text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#062B55]">
                      {stat.player.first_name} {stat.player.last_name}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {stat.team.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-[#062B55]">
                      {getStatValue(stat)}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {statLabel}
                    </p>
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