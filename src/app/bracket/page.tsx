"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { AppHeader } from "../components/layout/AppHeader";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { GroupStandings } from "../components/tournament/GroupStandings";
import { getGroupStandings, getMatchesByPhase, getMatches, applyAutoStatus, generateTournamentSchedule } from "../lib/api";
import { StandingRow, Match } from "../types/database";
import Link from "next/link";
import { useAuth } from "../components/auth/AuthProvider";
import { useTournamentSync } from "../lib/hooks/useTournamentSync";
import { toast } from "sonner";

type Tab = "gironi" | "fasi";

export default function BracketPage() {
  const { isAdmin } = useAuth();
  useTournamentSync();

  const [groupA, setGroupA] = useState<StandingRow[]>([]);
  const [groupB, setGroupB] = useState<StandingRow[]>([]);
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("gironi");
  const [hasMatches, setHasMatches] = useState(true);

  // Schedule generation
  const [scheduleDate, setScheduleDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const loadData = async () => {
    try {
      const [a, b, quarters, semis, finals, allMatches] = await Promise.all([
        getGroupStandings("A"),
        getGroupStandings("B"),
        getMatchesByPhase("quarter"),
        getMatchesByPhase("semi"),
        getMatchesByPhase("final"),
        getMatches(),
      ]);
      setGroupA(a);
      setGroupB(b);
      const all = applyAutoStatus([...quarters, ...semis, ...finals]);
      setKnockoutMatches(all);
      setLiveMatches(applyAutoStatus(allMatches).filter((m) => m.status === "live"));
      setHasMatches(allMatches.length > 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleGenerate() {
    if (!scheduleDate) {
      toast.error("Seleziona una data");
      return;
    }
    setGenerating(true);
    try {
      await generateTournamentSchedule(scheduleDate);
      toast.success("Calendario generato!");
      setLoading(true);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore nella generazione");
    }
    setGenerating(false);
  }

  if (loading) {
    return (
      <AppShell>
        <AppHeader title="Tabellone" subtitle="Gironi e fase finale" />
        <LoadingSpinner />
      </AppShell>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "gironi", label: "Gironi" },
    { key: "fasi", label: "Fasi Finali" },
  ];

  return (
    <AppShell>
      <AppHeader title="Tabellone" subtitle="Gironi e fase finale" />

      {/* Admin: Generate schedule (only if no matches exist) */}
      {isAdmin && !hasMatches && !loading && (
        <div className="mb-6 rounded-3xl border-2 border-dashed border-[#00C8E8] bg-cyan-50 p-5">
          <h3 className="text-lg font-black text-[#062B55]">📅 Genera Calendario</h3>
          <p className="mt-1 text-sm text-slate-600">
            Seleziona la data del torneo. Le partite verranno create automaticamente
            (gironi round-robin, 2 partite alla volta, 30 min + 15 min pausa).
          </p>
          <div className="mt-4 flex gap-3">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="rounded-2xl bg-[#062B55] px-6 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {generating ? "Genero..." : "Genera"}
            </button>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${
              tab === t.key
                ? "bg-[#062B55] text-white"
                : "border border-slate-200 bg-white text-[#062B55]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "gironi" && (
        <section className="space-y-6">
          <GroupStandings groupName="Girone A" rows={groupA} liveMatches={liveMatches} />
          <GroupStandings groupName="Girone B" rows={groupB} liveMatches={liveMatches} />
        </section>
      )}

      {tab === "fasi" && (
        <BracketTree matches={knockoutMatches} />
      )}
    </AppShell>
  );
}

/* ============================================================
   Champions League–style bracket tree
   ============================================================ */

function BracketTree({ matches }: { matches: Match[] }) {
  const quarters = matches.filter((m) => m.phase === "quarter");
  const semis = matches.filter((m) => m.phase === "semi");
  const finals = matches.filter((m) => m.phase === "final");

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-[700px] items-center justify-center gap-0">
        {/* Quarti column */}
        <RoundColumn label="Quarti" matches={quarters} roundSize={4} />

        {/* Connector QF → SF */}
        <ConnectorLines count={4} />

        {/* Semifinali column */}
        <RoundColumn label="Semifinali" matches={semis} roundSize={2} />

        {/* Connector SF → F */}
        <ConnectorLines count={2} />

        {/* Finale column */}
        <RoundColumn label="Finale" matches={finals} roundSize={1} isFinal />
      </div>
    </div>
  );
}

/* ---- Single round column ---- */
function RoundColumn({
  label,
  matches,
  roundSize,
  isFinal = false,
}: {
  label: string;
  matches: Match[];
  roundSize: number;
  isFinal?: boolean;
}) {
  // Pad to expected size with empty slots
  const slots: (Match | null)[] = [];
  for (let i = 0; i < roundSize; i++) {
    slots.push(matches[i] ?? null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-xs font-bold uppercase tracking-wider text-[#00C8E8]">
        {label}
      </span>
      <div
        className="flex flex-col justify-around"
        style={{ gap: isFinal ? "0px" : roundSize === 2 ? "64px" : "16px" }}
      >
        {slots.map((m, i) => (
          <BracketSlot key={m?.id ?? `empty-${i}`} match={m} isFinal={isFinal} />
        ))}
      </div>
    </div>
  );
}

/* ---- Single match slot in the bracket ---- */
function BracketSlot({
  match,
  isFinal,
}: {
  match: Match | null;
  isFinal: boolean;
}) {
  if (!match) {
    return (
      <div
        className={`flex flex-col overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 ${
          isFinal ? "w-44" : "w-36"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
          <span className="text-xs font-bold text-slate-300">-</span>
          <span className="text-sm font-black text-slate-300">-</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs font-bold text-slate-300">-</span>
          <span className="text-sm font-black text-slate-300">-</span>
        </div>
      </div>
    );
  }

  const homeName = match.home_team?.name ?? "TBD";
  const awayName = match.away_team?.name ?? "TBD";
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const hasScore = isLive || isFinished;

  const homeWin = hasScore && match.home_score > match.away_score;
  const awayWin = hasScore && match.away_score > match.home_score;

  const borderColor = isLive
    ? "border-green-400"
    : isFinished
      ? "border-slate-300"
      : "border-slate-200";

  return (
    <Link href={`/matches/${match.id}`} className="group">
      <div
        className={`flex flex-col overflow-hidden rounded-xl border-2 shadow-sm transition group-hover:border-[#00C8E8] ${borderColor} ${
          isFinal ? "w-44" : "w-36"
        } ${isFinal ? "ring-2 ring-yellow-300/50" : ""}`}
      >
        {/* Home row */}
        <div
          className={`flex items-center justify-between border-b px-3 py-2 ${
            homeWin ? "bg-green-50" : "bg-white"
          }`}
        >
          <span
            className={`truncate text-xs font-bold ${
              homeWin ? "text-green-700" : "text-[#062B55]"
            }`}
          >
            {homeName}
          </span>
          <span
            className={`ml-2 text-sm font-black ${
              homeWin ? "text-green-700" : "text-[#062B55]"
            }`}
          >
            {hasScore ? match.home_score : "-"}
          </span>
        </div>

        {/* Away row */}
        <div
          className={`flex items-center justify-between px-3 py-2 ${
            awayWin ? "bg-green-50" : "bg-white"
          }`}
        >
          <span
            className={`truncate text-xs font-bold ${
              awayWin ? "text-green-700" : "text-[#062B55]"
            }`}
          >
            {awayName}
          </span>
          <span
            className={`ml-2 text-sm font-black ${
              awayWin ? "text-green-700" : "text-[#062B55]"
            }`}
          >
            {hasScore ? match.away_score : "-"}
          </span>
        </div>

        {/* Status strip */}
        {isLive && (
          <div className="flex items-center justify-center gap-1 bg-green-500 px-2 py-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="text-[10px] font-bold text-white">LIVE</span>
          </div>
        )}
        {isFinished && (
          <div className="flex items-center justify-center bg-slate-100 px-2 py-0.5">
            <span className="text-[10px] font-bold text-slate-500">FT</span>
          </div>
        )}
      </div>

      {/* Trophy for final winner */}
      {isFinal && isFinished && (
        <div className="mt-2 text-center">
          <span className="text-2xl">🏆</span>
          <p className="text-xs font-black text-[#062B55]">
            {homeWin ? homeName : awayWin ? awayName : "Pareggio"}
          </p>
        </div>
      )}
    </Link>
  );
}

/* ---- SVG connector lines between rounds ---- */
function ConnectorLines({ count }: { count: number }) {
  // Draws bracket-style connector lines
  // count = number of matches in LEFT column (pairs merge into right column)
  const h = count === 4 ? 320 : count === 2 ? 240 : 120;
  const w = 32;

  if (count <= 1) {
    return (
      <div className="flex items-center" style={{ width: w, height: h }}>
        <svg width={w} height={h} className="text-slate-300">
          <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  const pairCount = Math.ceil(count / 2);
  const segH = h / count; // vertical space per source match
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let p = 0; p < pairCount; p++) {
    const topY = segH * (p * 2) + segH / 2;
    const botY = segH * (p * 2 + 1) + segH / 2;
    const midY = (topY + botY) / 2;

    // Horizontal from top match
    lines.push({ x1: 0, y1: topY, x2: w / 2, y2: topY });
    // Horizontal from bottom match
    lines.push({ x1: 0, y1: botY, x2: w / 2, y2: botY });
    // Vertical connecting them
    lines.push({ x1: w / 2, y1: topY, x2: w / 2, y2: botY });
    // Horizontal to next round
    lines.push({ x1: w / 2, y1: midY, x2: w, y2: midY });
  }

  return (
    <div className="flex items-center" style={{ width: w, height: h }}>
      <svg width={w} height={h} className="text-slate-300">
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="currentColor"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}