import { AppShell } from "./components/layout/AppShell";
import { Button } from "./components/ui/Button";

export default function HomePage() {
  return (
    <AppShell>
      <section className="space-y-5 pt-6">
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062B55] to-[#031A33] p-6 text-white shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-cyan-200">
                Official Tournament App
              </p>

              <h1 className="mt-2 text-5xl font-black tracking-tight">
                Santos Cup
              </h1>

              <p className="mt-4 max-w-[220px] text-sm leading-6 text-cyan-100">
                Torneo di calcio a 8 · 12 squadre · 2 gironi
              </p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/10 text-4xl font-black backdrop-blur">
              ⚽
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <p className="text-2xl font-black">12</p>
              <p className="text-xs text-cyan-100">Squadre</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <p className="text-2xl font-black">2</p>
              <p className="text-xs text-cyan-100">Gironi</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <p className="text-2xl font-black">2</p>
              <p className="text-xs text-cyan-100">Campi</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <Button href="/matches" fullWidth>
            Partite live
          </Button>

          <Button href="/bracket" variant="secondary" fullWidth>
            Tabellone torneo
          </Button>

          <Button href="/teams" variant="secondary" fullWidth>
            Squadre
          </Button>

          <Button href="/stats" variant="secondary" fullWidth>
            Statistiche
          </Button>
        </div>
      </section>
    </AppShell>
  );
}