"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../components/layout/AppShell";
import { AppHeader } from "../components/layout/AppHeader";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { getTeams } from "../lib/api";
import { useFavourites } from "../lib/hooks/useFavourites";
import { Team } from "../types/database";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTeamFav, toggleTeam } = useFavourites();

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .finally(() => setLoading(false));
  }, []);

  const groupA = teams.filter((t) => t.group_name === "A");
  const groupB = teams.filter((t) => t.group_name === "B");

  return (
    <AppShell>
      <AppHeader title="Squadre" subtitle="Tutte le squadre del torneo" />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="space-y-6">
          {/* Group A */}
          <div>
            <h2 className="mb-3 text-lg font-black text-[#062B55]">Girone A</h2>
            <div className="space-y-3">
              {groupA.map((team) => (
                <TeamListItem
                  key={team.id}
                  team={team}
                  isFav={isTeamFav(team.id)}
                  onToggleFav={() => toggleTeam(team.id)}
                />
              ))}
            </div>
          </div>

          {/* Group B */}
          <div>
            <h2 className="mb-3 text-lg font-black text-[#062B55]">Girone B</h2>
            <div className="space-y-3">
              {groupB.map((team) => (
                <TeamListItem
                  key={team.id}
                  team={team}
                  isFav={isTeamFav(team.id)}
                  onToggleFav={() => toggleTeam(team.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </AppShell>
  );
}

function TeamListItem({
  team,
  isFav,
  onToggleFav,
}: {
  team: Team;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#00C8E8]">
      <Link href={`/teams/${team.id}`} className="flex flex-1 items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#062B55] text-lg font-black text-white">
          {team.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-[#062B55]">{team.name}</p>
          <p className="text-sm text-slate-500">Girone {team.group_name}</p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFav();
        }}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
      >
        {isFav ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
