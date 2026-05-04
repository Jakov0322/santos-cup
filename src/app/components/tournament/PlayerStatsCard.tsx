import { PlayerStat } from "@/app/lib/tournament/stats";

type PlayerStatsCardProps = {
  player: PlayerStat;
  position: number;
};

export function PlayerStatsCard({
  player,
  position,
}: PlayerStatsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#062B55] font-black text-white">
          {position}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-[#062B55]">
            {player.playerName}
          </p>

          <p className="truncate text-sm text-slate-500">
            {player.teamName}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-[#062B55]">
            {player.goals}
          </p>

          <p className="text-xs font-semibold text-slate-500">
            Gol
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-black text-[#062B55]">{player.assists}</p>
          <p className="text-xs text-slate-500">Assist</p>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-3">
          <p className="font-black text-yellow-700">{player.yellowCards}</p>
          <p className="text-xs text-slate-500">Gialli</p>
        </div>

        <div className="rounded-2xl bg-red-50 p-3">
          <p className="font-black text-red-700">{player.redCards}</p>
          <p className="text-xs text-slate-500">Rossi</p>
        </div>
      </div>
    </div>
  );
}