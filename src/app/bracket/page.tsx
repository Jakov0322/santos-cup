import { AppShell } from "../components/layout/AppShell";
import { BracketMatchCard } from "../components/tournament/BracketMatchCard";
import { bracketMatches } from "../lib/tournament/bracket";

export default function BracketPage() {
  const rounds = ["Quarti", "Semifinali", "Finale"] as const;

  return (
    <AppShell>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-black text-[#062B55]">
            Tabellone
          </h1>

          <p className="mt-1 text-slate-500">
            Fase finale della Santos Cup
          </p>
        </div>

        {rounds.map((round) => (
          <div key={round} className="space-y-3">
            <h2 className="text-xl font-black text-[#062B55]">
              {round}
            </h2>

            {bracketMatches
              .filter((match) => match.round === round)
              .map((match) => (
                <BracketMatchCard key={match.id} match={match} />
              ))}
          </div>
        ))}
      </section>
    </AppShell>
  );
}