import { Match, StandingRow } from "@/app/types/database";

type GroupStandingsProps = {
  groupName: string;
  rows: StandingRow[];
  liveMatches?: Match[];
};

function getLiveBadge(
  teamId: string,
  liveMatches: Match[]
): { score: string; color: string } | null {
  for (const m of liveMatches) {
    const isHome = m.home_team_id === teamId;
    const isAway = m.away_team_id === teamId;
    if (!isHome && !isAway) continue;

    const homeScore = m.home_score;
    const awayScore = m.away_score;
    const teamScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;

    let color = "bg-yellow-400 text-yellow-900"; // draw
    if (teamScore > oppScore) color = "bg-green-500 text-white";
    else if (teamScore < oppScore) color = "bg-red-500 text-white";

    return { score: `${teamScore}:${oppScore}`, color };
  }
  return null;
}

export function GroupStandings({
  groupName,
  rows,
  liveMatches = [],
}: GroupStandingsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-[#062B55] px-4 py-3">
        <h2 className="font-bold text-white">
          {groupName}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Squadra</th>
              <th className="px-2 py-3 text-center">PG</th>
              <th className="px-2 py-3 text-center">V</th>
              <th className="px-2 py-3 text-center">N</th>
              <th className="px-2 py-3 text-center">P</th>
              <th className="px-2 py-3 text-center">GF</th>
              <th className="px-2 py-3 text-center">GS</th>
              <th className="px-2 py-3 text-center">DR</th>
              <th className="px-4 py-3 text-center">Pt</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const badge = getLiveBadge(row.team.id, liveMatches);
              return (
                <tr
                  key={row.team.id}
                  className={`border-b border-slate-100 text-sm ${
                    index < 4 ? "bg-green-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-4 font-bold text-[#062B55]">
                    {index + 1}
                  </td>

                  <td className="px-4 py-4 font-semibold text-[#062B55]">
                    <div className="flex items-center gap-2">
                      <a href={`/teams/${row.team.id}`} className="hover:text-[#00C8E8]">
                        {row.team.name}
                      </a>
                      {badge && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.color}`}>
                          {badge.score}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-2 py-4 text-center">{row.played}</td>
                  <td className="px-2 py-4 text-center">{row.won}</td>
                  <td className="px-2 py-4 text-center">{row.draw}</td>
                  <td className="px-2 py-4 text-center">{row.lost}</td>
                  <td className="px-2 py-4 text-center">{row.goals_for}</td>
                  <td className="px-2 py-4 text-center">{row.goals_against}</td>
                  <td className="px-2 py-4 text-center font-bold">
                    {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                  </td>
                  <td className="px-4 py-4 text-center font-black text-[#062B55]">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}