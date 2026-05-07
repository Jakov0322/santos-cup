import { StandingRow } from "@/app/types/database";

type GroupStandingsProps = {
  groupName: string;
  rows: StandingRow[];
};

export function GroupStandings({
  groupName,
  rows,
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
            {rows.map((row, index) => (
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
                  <a href={`/teams/${row.team.id}`} className="hover:text-[#00C8E8]">
                    {row.team.name}
                  </a>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}