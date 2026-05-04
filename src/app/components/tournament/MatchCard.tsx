import { Match } from "@/app/types/database";
import { LivePulse } from "../ui/LivePulse";
import { MATCH_STATUSES } from "@/app/lib/constants/tournament";

type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
  return (
  <a href={`/matches/${match.id}`}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#00C8E8]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {match.phase}
          </p>

          <p className="text-sm text-slate-500">
            {match.startsAt} · Campo {match.field}
          </p>
        </div>

        <div>
          {match.status === MATCH_STATUSES.LIVE && (
            <div className="rounded-full bg-red-100 px-3 py-1">
              <LivePulse />
            </div>
          )}

          {match.status === MATCH_STATUSES.FINISHED && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              FT
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[#062B55]">
            {match.homeTeam}
          </p>

          <p
  className={`text-lg font-black ${
    match.status === MATCH_STATUSES.LIVE
      ? "animate-pulse"
      : ""
  }`}
>
            {match.homeScore}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-semibold text-[#062B55]">
            {match.awayTeam}
          </p>

          <p
  className={`text-lg font-black ${
    match.status === MATCH_STATUSES.LIVE
      ? "animate-pulse"
      : ""
  }`}
>
            {match.awayScore}
          </p>
        </div>
      </div>
    </div>
  </a>
);
}