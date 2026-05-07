import { Match } from "@/app/types/database";
import { LivePulse } from "../ui/LivePulse";

type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
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

  return (
    <a href={`/matches/${match.id}`}>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#00C8E8]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {phaseLabel}
            </p>
            <p className="text-sm text-slate-500">
              {timeLabel} · Campo {match.field_number}
            </p>
          </div>

          <div>
            {match.status === "live" && (
              <div className="rounded-full bg-red-100 px-3 py-1">
                <LivePulse />
              </div>
            )}
            {match.status === "finished" && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                FT
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#062B55]">{homeName}</p>
            <p className={`text-lg font-black ${match.status === "live" ? "animate-pulse" : ""}`}>
              {match.status === "scheduled" ? "-" : match.home_score}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#062B55]">{awayName}</p>
            <p className={`text-lg font-black ${match.status === "live" ? "animate-pulse" : ""}`}>
              {match.status === "scheduled" ? "-" : match.away_score}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}