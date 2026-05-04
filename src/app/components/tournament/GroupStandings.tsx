type StandingRow = {
  team: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

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
              <th className="px-4 py-3 text-center">Pt</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.team}
                className="border-b border-slate-100 text-sm"
              >
                <td className="px-4 py-4 font-bold text-[#062B55]">
                  {index + 1}
                </td>

                <td className="px-4 py-4 font-semibold text-[#062B55]">
                  {row.team}
                </td>

                <td className="px-2 py-4 text-center">
                  {row.played}
                </td>

                <td className="px-2 py-4 text-center">
                  {row.won}
                </td>

                <td className="px-2 py-4 text-center">
                  {row.draw}
                </td>

                <td className="px-2 py-4 text-center">
                  {row.lost}
                </td>

                <td className="px-2 py-4 text-center">
                  {row.goalsFor}
                </td>

                <td className="px-2 py-4 text-center">
                  {row.goalsAgainst}
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