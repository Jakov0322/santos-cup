"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/app/components/layout/AppShell";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { GroupStandings } from "@/app/components/tournament/GroupStandings";
import { MatchCard } from "@/app/components/tournament/MatchCard";
import {
  getTeamById,
  getPlayersByTeam,
  getMatchesByTeam,
  getGroupStandings,
  getTeamStats,
  applyAutoStatus,
} from "@/app/lib/api";
import { Team, Player, Match, StandingRow, PlayerStats } from "@/app/types/database";

type Tab = "torneo" | "calendario" | "rosa";

export default function TeamDetailPage() {
  const params = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("torneo");

  useEffect(() => {
    if (!params.id) return;
    const id = params.id as string;

    getTeamById(id).then(async (t) => {
      if (!t) {
        setLoading(false);
        return;
      }
      setTeam(t);

      const [p, m, s, st] = await Promise.all([
        getPlayersByTeam(id),
        getMatchesByTeam(id),
        getGroupStandings(t.group_name),
        getTeamStats(id),
      ]);

      setPlayers(p);
      setMatches(applyAutoStatus(m));
      setStandings(s);
      setStats(st);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <AppShell>
        <LoadingSpinner />
      </AppShell>
    );
  }

  if (!team) {
    return (
      <AppShell>
        <section className="space-y-5 pt-5">
          <Link href="/teams" className="text-sm font-bold text-[#00C8E8]">
            ← Torna alle squadre
          </Link>
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="font-black text-[#062B55]">Squadra non trovata</p>
          </div>
        </section>
      </AppShell>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "torneo", label: "Torneo" },
    { key: "calendario", label: "Calendario" },
    { key: "rosa", label: "Rosa" },
  ];

  return (
    <AppShell>
      <section className="space-y-5 pt-5">
        <Link href="/teams" className="text-sm font-bold text-[#00C8E8]">
          ← Torna alle squadre
        </Link>

        {/* Team Header */}
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062B55] to-[#031A33] p-6 text-white shadow-2xl">
          <p className="text-sm text-cyan-200">Girone {team.group_name}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">{team.name}</h1>
        </div>

        {/* Tab Switcher */}
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

        {/* Tab Content */}
        {tab === "torneo" && (
          <TorneoTab standings={standings} stats={stats} teamId={team.id} liveMatches={matches.filter((m) => m.status === "live")} />
        )}
        {tab === "calendario" && <CalendarioTab matches={matches} />}
        {tab === "rosa" && <RosaTab players={players} stats={stats} />}
      </section>
    </AppShell>
  );
}

// ============================================
// TORNEO TAB
// ============================================

function TorneoTab({
  standings,
  stats,
  teamId,
  liveMatches,
}: {
  standings: StandingRow[];
  stats: PlayerStats[];
  teamId: string;
  liveMatches: Match[];
}) {
  const teamStanding = standings.find((s) => s.team.id === teamId);
  const totalGoals = stats.reduce((acc, s) => acc + s.goals, 0);
  const totalMvp = stats.reduce((acc, s) => acc + s.mvp_awards, 0);

  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      {teamStanding && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <p className="text-2xl font-black text-[#062B55]">{teamStanding.points}</p>
            <p className="text-xs text-slate-500">Punti</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <p className="text-2xl font-black text-[#062B55]">{totalGoals}</p>
            <p className="text-xs text-slate-500">Gol</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <p className="text-2xl font-black text-[#062B55]">{totalMvp}</p>
            <p className="text-xs text-slate-500">MVP</p>
          </div>
        </div>
      )}

      {/* Group Standings */}
      <GroupStandings
        groupName={`Girone ${standings[0]?.team.group_name ?? ""}`}
        rows={standings}
        liveMatches={liveMatches}
      />
    </div>
  );
}

// ============================================
// CALENDARIO TAB
// ============================================

function CalendarioTab({ matches }: { matches: Match[] }) {
  const live = matches.filter((m) => m.status === "live");
  const finished = matches.filter((m) => m.status === "finished");
  const scheduled = matches.filter((m) => m.status === "scheduled");

  return (
    <div className="space-y-5">
      {live.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-black text-red-600">🔴 In corso</h3>
          {live.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}

      {scheduled.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-black text-[#062B55]">Prossime partite</h3>
          {scheduled.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}

      {finished.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-black text-slate-500">Partite giocate</h3>
          {finished.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}

      {matches.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-black text-[#062B55]">Nessuna partita in programma</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// ROSA TAB
// ============================================

function RosaTab({ players, stats }: { players: Player[]; stats: PlayerStats[] }) {
  const positionOrder = ["GK", "DEF", "MID", "FWD"] as const;
  const positionLabels: Record<string, string> = {
    GK: "Portieri",
    DEF: "Difensori",
    MID: "Centrocampisti",
    FWD: "Attaccanti",
  };

  const getPlayerStats = (playerId: string) => stats.find((s) => s.player.id === playerId);

  return (
    <div className="space-y-5">
      {positionOrder.map((pos) => {
        const posPlayers = players.filter((p) => p.position === pos);
        if (posPlayers.length === 0) return null;

        return (
          <div key={pos}>
            <h3 className="mb-3 text-lg font-black text-[#062B55]">
              {positionLabels[pos]}
            </h3>
            <div className="space-y-3">
              {posPlayers.map((player) => {
                const pStats = getPlayerStats(player.id);
                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#062B55] text-lg font-black text-white">
                      {player.shirt_number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-[#062B55]">
                        {player.first_name} {player.last_name}
                        {player.is_captain && (
                          <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-yellow-900">C</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{positionLabels[pos]}</p>
                    </div>
                    <div className="flex gap-3 text-center text-xs">
                      <div>
                        <p className="font-black text-[#062B55]">{pStats?.goals ?? 0}</p>
                        <p className="text-slate-500">Gol</p>
                      </div>
                      <div>
                        <p className="font-black text-[#062B55]">{pStats?.mvp_awards ?? 0}</p>
                        <p className="text-slate-500">MVP</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {players.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-black text-[#062B55]">Rosa non ancora disponibile</p>
        </div>
      )}
    </div>
  );
}
