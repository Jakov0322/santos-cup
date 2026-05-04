import { LiveStandingRow } from "@/app/lib/tournament/standings-engine";

type LiveStandingsTableProps = {
  title: string;
  rows: LiveStandingRow[];
};

function LiveScoreBadge({
  score,
}: {
  score?: LiveStandingRow["liveScore"];
}) {
  if (!score) return <span className="text-slate-300">—</span>;

  const className =
    score.result === "winning"
      ? "bg-green-100 text-green-700"
      : score.result === "losing"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {score.for}-{score.against}
    </span>
  );
}

function Trend({
  value,
}: {
  value: number;
}) {
  if (value > 0) {
    return <span className="font-black text-green-600">↑</span>;
  }

  if (value < 0) {
    return <span className="font-black text-red-600">↓</span>;
  }

  return <span className="font-black text-slate-400">-</span>;
}

export function LiveStandingsTable({
  title,
  rows,
}: LiveStandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#062B55] px-4 py-4">
        <h2 className="font-black text-white">{title}</h2>

        <p className="mt-1 text-xs font-semibold text-cyan-100">
          Classifica proiettata con risultati live
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
              <th className="px-3 py-3 text-left">#</th>
              <th className="px-3 py-3 text-center">Mov</th>
              <th className="px-3 py-3 text-left">Squadra</th>
              <th className="px-3 py-3 text-center">Live</th>
              <th className="px-3 py-3 text-center">PG</th>
              <th className="px-3 py-3 text-center">V</th>
              <th className="px-3 py-3 text-center">N</th>
              <th className="px-3 py-3 text-center">P</th>
              <th className="px-3 py-3 text-center">GF</th>
              <th className="px-3 py-3 text-center">GS</th>
              <th className="px-3 py-3 text-center">DR</th>
              <th className="px-3 py-3 text-center">Pt</th>
              <th className="px-3 py-3 text-center">ΔPt</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.team}
                className="border-b border-slate-100 text-sm"
              >
                <td className="px-3 py-4 font-black text-[#062B55]">
                  {row.position}
                </td>

                <td className="px-3 py-4 text-center">
                  <Trend value={row.positionDelta} />
                </td>

                <td className="px-3 py-4 font-bold text-[#062B55]">
                  {row.team}
                </td>

                <td className="px-3 py-4 text-center">
                  <LiveScoreBadge score={row.liveScore} />
                </td>

                <td className="px-3 py-4 text-center">{row.played}</td>
                <td className="px-3 py-4 text-center">{row.won}</td>
                <td className="px-3 py-4 text-center">{row.draw}</td>
                <td className="px-3 py-4 text-center">{row.lost}</td>
                <td className="px-3 py-4 text-center">{row.goalsFor}</td>
                <td className="px-3 py-4 text-center">{row.goalsAgainst}</td>

                <td className="px-3 py-4 text-center font-bold">
                  {row.goalDifference > 0
                    ? `+${row.goalDifference}`
                    : row.goalDifference}
                </td>

                <td className="px-3 py-4 text-center text-lg font-black text-[#062B55]">
                  {row.points}
                </td>

                <td className="px-3 py-4 text-center">
                  {row.pointsDelta > 0 ? (
                    <span className="font-black text-green-600">
                      +{row.pointsDelta}
                    </span>
                  ) : (
                    <span className="font-black text-slate-400">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}