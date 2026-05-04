import { MATCH_STATUSES } from "@/app/lib/constants/tournament";
import { BracketMatch } from "@/app/lib/tournament/bracket";

type BracketMatchCardProps = {
  match: BracketMatch;
};

export function BracketMatchCard({ match }: BracketMatchCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#00C8E8]">
            {match.round}
          </p>

          <p className="text-sm text-slate-500">
            {match.startsAt} · Campo {match.field}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {match.status === MATCH_STATUSES.FINISHED
            ? "FT"
            : match.status === MATCH_STATUSES.LIVE
              ? "LIVE"
              : "Da giocare"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between gap-3">
          <p className="font-bold text-[#062B55]">{match.homeTeam}</p>
          <p className="font-black text-[#062B55]">
            {match.homeScore ?? "-"}
          </p>
        </div>

        <div className="flex justify-between gap-3">
          <p className="font-bold text-[#062B55]">{match.awayTeam}</p>
          <p className="font-black text-[#062B55]">
            {match.awayScore ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}