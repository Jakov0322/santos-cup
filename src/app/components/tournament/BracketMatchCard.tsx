import { Match } from "@/app/types/database";
import Link from "next/link";
import { LivePulse } from "../ui/LivePulse";

type BracketMatchCardProps = {
  match: Match;
};

export function BracketMatchCard({ match }: BracketMatchCardProps) {
  const homeName = match.home_team?.name ?? "TBD";
  const awayName = match.away_team?.name ?? "TBD";

  const phaseLabel =
    match.phase === "quarter"
      ? "Quarti"
      : match.phase === "semi"
        ? "Semifinale"
        : "Finale";

  const timeLabel = new Date(match.starts_at).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#00C8E8]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#00C8E8]">
              {phaseLabel}
            </p>
            <p className="text-sm text-slate-500">
              {timeLabel} · Campo {match.field_number}
            </p>
          </div>

          {match.status === "live" && <LivePulse />}
          {match.status === "finished" && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              FT
            </span>
          )}
          {match.status === "scheduled" && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              Da giocare
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between gap-3">
            <p className="font-bold text-[#062B55]">{homeName}</p>
            <p className="font-black text-[#062B55]">
              {match.status === "scheduled" ? "-" : match.home_score}
            </p>
          </div>

          <div className="flex justify-between gap-3">
            <p className="font-bold text-[#062B55]">{awayName}</p>
            <p className="font-black text-[#062B55]">
              {match.status === "scheduled" ? "-" : match.away_score}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}