import { AppShell } from "../components/layout/AppShell";
import { PlayerStatsCard } from "../components/tournament/PlayerStatsCard";
import { playerStats } from "../lib/tournament/stats";

export default function StatsPage() {
  const sortedStats = [...playerStats].sort((a, b) => b.goals - a.goals);

  return (
    <AppShell>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-black text-[#062B55]">
            Statistiche
          </h1>

          <p className="mt-1 text-slate-500">
            Marcatori, assist e cartellini del torneo
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="rounded-full bg-[#062B55] px-4 py-2 text-sm font-bold text-white">
            Marcatori
          </button>

          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#062B55]">
            Assist
          </button>

          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#062B55]">
            Cartellini
          </button>
        </div>

        <div className="space-y-4">
          {sortedStats.map((player, index) => (
            <PlayerStatsCard
              key={player.id}
              player={player}
              position={index + 1}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}