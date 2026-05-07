"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/app/components/auth/AuthProvider";
import { AppShell } from "@/app/components/layout/AppShell";
import { LivePulse } from "@/app/components/ui/LivePulse";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import {
  getMatchById,
  getMatchEvents,
  getPlayersByTeams,
  addGoal,
  getMvpNominations,
  setMvpNominations,
  castMvpVote,
  getMvpVotes,
  hasVoted,
  computeMatchStatus,
} from "@/app/lib/api";
import { Match, MatchEvent, Player, MvpNomination } from "@/app/types/database";
import { useTournamentSync } from "@/app/lib/hooks/useTournamentSync";
import { toast } from "sonner";

function getVoterUid(): string {
  if (typeof window === "undefined") return "";
  let uid = localStorage.getItem("santos_voter_uid");
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem("santos_voter_uid", uid);
  }
  return uid;
}

export default function MatchDetailsPage() {
  const params = useParams();
  const { isAdmin } = useAuth();
  useTournamentSync();
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [nominations, setNominations] = useState<MvpNomination[]>([]);
  const [voteCounts, setVoteCounts] = useState<{ player_id: string; count: number }[]>([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin modals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showMvpModal, setShowMvpModal] = useState(false);

  // Goal modal state — only 2 fields: team then player
  const [goalTeamId, setGoalTeamId] = useState("");
  const [goalPlayerId, setGoalPlayerId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // MVP modal state — 3 dropdowns
  const [mvp1, setMvp1] = useState("");
  const [mvp2, setMvp2] = useState("");
  const [mvp3, setMvp3] = useState("");

  const loadData = useCallback(async () => {
    if (!params.id) return;
    const id = params.id as string;

    const [m, e] = await Promise.all([getMatchById(id), getMatchEvents(id)]);
    if (!m) {
      setMatch(null);
      setLoading(false);
      return;
    }

    const withStatus = computeMatchStatus(m);
    setMatch(withStatus);
    setEvents(e);

    const teamIds = [m.home_team_id, m.away_team_id].filter(Boolean) as string[];
    if (teamIds.length > 0) {
      const p = await getPlayersByTeams(teamIds);
      setPlayers(p);
    }

    const noms = await getMvpNominations(id);
    setNominations(noms);

    if (noms.length > 0) {
      const vc = await getMvpVotes(id);
      setVoteCounts(vc);
      const voted = await hasVoted(id, getVoterUid());
      setAlreadyVoted(voted);
    }

    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---- Admin: add goal ----
  async function handleAddGoal() {
    if (!match || !goalPlayerId || !goalTeamId) return;
    setSubmitting(true);
    try {
      await addGoal({
        matchId: match.id,
        playerId: goalPlayerId,
        teamId: goalTeamId,
        minute: 0,
      });
      toast.success("Gol aggiunto");
      setShowGoalModal(false);
      setGoalTeamId("");
      setGoalPlayerId("");
      await loadData();
    } catch {
      toast.error("Errore nell'aggiungere il gol");
    }
    setSubmitting(false);
  }

  // ---- Admin: set MVP nominations ----
  async function handleSetMvp() {
    if (!match) return;
    const ids = [mvp1, mvp2, mvp3].filter(Boolean);
    if (ids.length !== 3) {
      toast.error("Seleziona 3 giocatori");
      return;
    }
    if (new Set(ids).size !== 3) {
      toast.error("Seleziona 3 giocatori diversi");
      return;
    }
    setSubmitting(true);
    try {
      await setMvpNominations(match.id, ids);
      toast.success("Candidati MVP salvati");
      setShowMvpModal(false);
      await loadData();
    } catch {
      toast.error("Errore nel salvare i candidati");
    }
    setSubmitting(false);
  }

  // ---- User: vote MVP ----
  async function handleVote(playerId: string) {
    if (!match || alreadyVoted) return;
    const { error } = await castMvpVote(match.id, playerId, getVoterUid());
    if (error) {
      toast.error(error);
    } else {
      toast.success("Voto registrato!");
      setAlreadyVoted(true);
      await loadData();
    }
  }

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

  const homePlayers = players.filter((p) => p.team_id === match.home_team_id);
  const awayPlayers = players.filter((p) => p.team_id === match.away_team_id);
  const goalTeamPlayers =
    goalTeamId === match.home_team_id
      ? homePlayers
      : goalTeamId === match.away_team_id
        ? awayPlayers
        : [];

  const isLive = match.status === "live";
  // Knockout draw needing resolution: match time ended but scores tied
  const needsResolution =
    match.phase !== "group" &&
    match.status === "finished" &&
    match.home_score === match.away_score;
  const showAdminTools = isAdmin && (isLive || needsResolution);

  return (
    <AppShell>
      <section className="space-y-5 pt-5">
        <a href="/matches" className="text-sm font-bold text-[#00C8E8]">
          ← Torna alle partite
        </a>

        {/* Scoreboard */}
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

        {/* ===== ADMIN CONTROLS ===== */}
        {showAdminTools && (
          <div className="space-y-3">
            {needsResolution && (
              <div className="rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-center text-sm font-bold text-yellow-800">
                ⚠️ Pareggio nei tempi regolamentari — aggiungi gol per i rigori/supplementari
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowGoalModal(true)}
                className="flex-1 rounded-2xl bg-[#00C8E8] px-4 py-3 text-sm font-black text-[#031A33]"
              >
                ⚽ Aggiungi Gol
              </button>
              <button
                onClick={() => setShowMvpModal(true)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-[#062B55]"
              >
                ⭐ Seleziona MVP
              </button>
            </div>
          </div>
        )}

        {/* ===== ADMIN MODAL: Add Goal (Team → Player → Fine) ===== */}
        {showGoalModal && (
          <div className="rounded-3xl border border-[#00C8E8] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-[#062B55]">Aggiungi Gol</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-bold text-[#062B55]">Squadra</label>
                <select
                  value={goalTeamId}
                  onChange={(e) => {
                    setGoalTeamId(e.target.value);
                    setGoalPlayerId("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                >
                  <option value="">Seleziona squadra</option>
                  {match.home_team_id && <option value={match.home_team_id}>{homeName}</option>}
                  {match.away_team_id && <option value={match.away_team_id}>{awayName}</option>}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-[#062B55]">Marcatore</label>
                <select
                  value={goalPlayerId}
                  onChange={(e) => setGoalPlayerId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:opacity-40"
                  disabled={!goalTeamId}
                >
                  <option value="">
                    {goalTeamId ? "Seleziona giocatore" : "Prima seleziona la squadra"}
                  </option>
                  {goalTeamPlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.shirt_number} {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddGoal}
                  disabled={submitting || !goalPlayerId}
                  className="flex-1 rounded-2xl bg-[#00C8E8] py-3 text-sm font-black text-[#031A33] disabled:opacity-50"
                >
                  {submitting ? "Salvo..." : "Fine"}
                </button>
                <button
                  onClick={() => {
                    setShowGoalModal(false);
                    setGoalTeamId("");
                    setGoalPlayerId("");
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-black text-slate-500"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== ADMIN MODAL: Seleziona MVP (3 dropdowns) ===== */}
        {showMvpModal && (
          <div className="rounded-3xl border border-[#00C8E8] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-[#062B55]">Seleziona MVP</h3>
            <p className="mt-1 text-sm text-slate-500">Scegli 3 candidati per il voto MVP</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Candidato 1", value: mvp1, setter: setMvp1 },
                { label: "Candidato 2", value: mvp2, setter: setMvp2 },
                { label: "Candidato 3", value: mvp3, setter: setMvp3 },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="mb-1 block text-sm font-bold text-[#062B55]">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  >
                    <option value="">Seleziona</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.shirt_number} {p.first_name} {p.last_name} ({p.team_id === match.home_team_id ? homeName : awayName})
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSetMvp}
                  disabled={submitting}
                  className="flex-1 rounded-2xl bg-[#00C8E8] py-3 text-sm font-black text-[#031A33] disabled:opacity-50"
                >
                  {submitting ? "Salvo..." : "Conferma"}
                </button>
                <button
                  onClick={() => setShowMvpModal(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-black text-slate-500"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MVP VOTING (only unlogged users see vote buttons) ===== */}
        {!isAdmin && nominations.length > 0 && (match.status === "live" || match.status === "finished") && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-[#062B55]">⭐ Vota MVP</h2>
            <p className="mt-1 text-sm text-slate-500">
              {alreadyVoted
                ? "Hai già votato per questa partita"
                : match.status === "finished"
                  ? "Votazione chiusa"
                  : "Scegli il migliore in campo"}
            </p>
            <div className="mt-4 space-y-3">
              {nominations.map((nom) => {
                const voteData = voteCounts.find((v) => v.player_id === nom.player_id);
                const count = voteData?.count ?? 0;
                const totalVotes = voteCounts.reduce((sum, v) => sum + v.count, 0);
                const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

                return (
                  <div
                    key={nom.id}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 p-4"
                  >
                    {(alreadyVoted || match.status === "finished") && (
                      <div
                        className="absolute inset-y-0 left-0 bg-[#00C8E8]/10"
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#062B55]">
                          {nom.player?.first_name} {nom.player?.last_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {nom.player?.team_id === match.home_team_id ? homeName : awayName}
                        </p>
                      </div>

                      {alreadyVoted || match.status === "finished" ? (
                        <span className="text-sm font-black text-[#062B55]">
                          {count} ({pct}%)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVote(nom.player_id)}
                          className="rounded-xl bg-[#062B55] px-4 py-2 text-sm font-black text-white"
                        >
                          Vota
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Goals */}
        {goals.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-[#062B55]">Gol</h2>
            <div className="mt-4 space-y-3">
              {goals.map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm">
                    ⚽
                  </span>
                  <div>
                    <p className="font-bold text-[#062B55]">
                      {event.player?.first_name} {event.player?.last_name}
                    </p>
                    <p className="text-xs text-slate-500">{event.team?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </section>
    </AppShell>
  );
}