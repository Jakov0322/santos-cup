import { AppShell } from "@/app/components/layout/AppShell";

import {
  generateGroupMatches,
  generateGroups,
} from "@/app/lib/tournament/generator";

import { tournamentTeams } from "@/app/lib/tournament/mock-teams";

export default function TournamentGeneratorPage() {
  const groups = generateGroups(tournamentTeams);

  const matches = generateGroupMatches(groups);

  return (
    <AppShell showBottomNav={false}>
      <section className="space-y-6">
        <div>
          <a
            href="/admin"
            className="text-sm font-bold text-[#00C8E8]"
          >
            ← Torna dashboard
          </a>

          <h1 className="mt-3 text-3xl font-black text-[#062B55]">
            Generatore torneo
          </h1>

          <p className="mt-1 text-slate-500">
            Struttura automatica Santos Cup
          </p>
        </div>

        <div className="space-y-4">
          {groups.map((group, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-black text-[#062B55]">
                Girone {String.fromCharCode(65 + index)}
              </h2>

              <div className="mt-4 space-y-2">
                {group.map((team) => (
                  <div
                    key={team}
                    className="rounded-2xl bg-slate-50 px-4 py-3 font-semibold text-[#062B55]"
                  >
                    {team}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#062B55]">
            Calendario generato
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Partite automatiche sui 2 campi
          </p>
        </div>

        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#00C8E8]">
                    {match.phase}
                  </p>

                  <h3 className="mt-1 text-lg font-black text-[#062B55]">
                    {match.homeTeam}
                  </h3>

                  <p className="my-1 text-sm font-bold text-slate-400">
                    vs
                  </p>

                  <h3 className="text-lg font-black text-[#062B55]">
                    {match.awayTeam}
                  </h3>
                </div>

                <div className="rounded-2xl bg-[#062B55] px-4 py-3 text-center text-white">
                  <p className="text-xs text-cyan-200">
                    Campo
                  </p>

                  <p className="text-xl font-black">
                    {match.field}
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {match.startsAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}