"use client";

import { useState } from "react";
import { Match } from "@/app/types/database";
import { toast } from "sonner";
import { MATCH_STATUSES } from "@/app/lib/constants/tournament";

type AdminMatchEditorCardProps = {
  match: Match;
};

export function AdminMatchEditorCard({
  match,
}: AdminMatchEditorCardProps) {
  const [homeScore, setHomeScore] = useState(match.homeScore);
  const [awayScore, setAwayScore] = useState(match.awayScore);
  const [status, setStatus] = useState(match.status);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#00C8E8]">
            {match.phase}
          </p>

          <h2 className="mt-1 text-lg font-black text-[#062B55]">
            {match.homeTeam} vs {match.awayTeam}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {match.startsAt} · Campo {match.field}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4 text-center">
          <p className="mb-2 text-sm font-bold text-[#062B55]">
            {match.homeTeam}
          </p>

          <input
            type="number"
            min={0}
            value={homeScore}
            onChange={(e) => setHomeScore(Number(e.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-2xl font-black text-[#062B55] outline-none focus:border-[#00C8E8]"
          />
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-center">
          <p className="mb-2 text-sm font-bold text-[#062B55]">
            {match.awayTeam}
          </p>

          <input
            type="number"
            min={0}
            value={awayScore}
            onChange={(e) => setAwayScore(Number(e.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-2xl font-black text-[#062B55] outline-none focus:border-[#00C8E8]"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => setStatus(MATCH_STATUSES.SCHEDULED)}
          className={`rounded-2xl px-3 py-3 text-sm font-bold ${
            status === MATCH_STATUSES.SCHEDULED
              ? "bg-[#062B55] text-white"
              : "bg-slate-100 text-[#062B55]"
          }`}
        >
          Programmata
        </button>

        <button
          onClick={() => setStatus(MATCH_STATUSES.LIVE)}
          className={`rounded-2xl px-3 py-3 text-sm font-bold ${
            status === MATCH_STATUSES.LIVE
              ? "bg-red-600 text-white"
              : "bg-slate-100 text-[#062B55]"
          }`}
        >
          Live
        </button>

        <button
          onClick={() => setStatus(MATCH_STATUSES.FINISHED)}
          className={`rounded-2xl px-3 py-3 text-sm font-bold ${
            status === MATCH_STATUSES.FINISHED
              ? "bg-green-600 text-white"
              : "bg-slate-100 text-[#062B55]"
          }`}
        >
          Finita
        </button>
      </div>

            <button
        onClick={() => {
          console.log({
            matchId: match.id,
            homeScore,
            awayScore,
            status,
          });

          toast.success("Risultato aggiornato");
        }}
        className="mt-4 w-full rounded-2xl bg-[#00C8E8] px-4 py-4 font-black text-[#031A33]"
      >
        Salva risultato
      </button>

      <a
        href={`/admin/matches/${match.id}`}
        className="mt-3 block rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center font-black text-[#062B55]"
      >
        Gestisci eventi live
      </a>
    </div>
  );
}