import { AppShell } from "../components/layout/AppShell";
import { SantosCard } from "../components/ui/SantosCard";
import { PlayerQrCard } from "../components/team/PlayerQrCard";
import { TeamStatusCard } from "../components/team/TeamStatusCard";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import {
  currentTeam,
  currentTeamPlayers,
} from "../lib/team/mock-current-team";
import { Button } from "../components/ui/Button";

export default function DashboardPage() {
  const isConfirmed = currentTeam.paymentStatus === "confirmed";

  return (
      <ProtectedRoute
    allowedRoles={["captain", "admin"]}
  >
    <AppShell>
      <section className="space-y-5 pt-6">
        <TeamStatusCard team={currentTeam} />

        {!isConfirmed ? (
          <SantosCard>
            <h2 className="text-xl font-black text-[#062B55]">
              Pagamento non confermato
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Completa il pagamento o attendi la verifica dello staff per
              sbloccare calendario, gironi, tabellone e QR.
            </p>

            <Button
              href="/payment"
              variant="primary"
              fullWidth
            >
              Vai al pagamento
            </Button>
          </SantosCard>
        ) : (
          <>
            <SantosCard>
              <h2 className="text-xl font-black text-[#062B55]">
                Area torneo sbloccata
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                La tua iscrizione è confermata. Puoi consultare partite,
                classifiche, tabellone e statistiche live.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button
  href="/matches"
  variant="secondary"
  fullWidth
>
                  Partite
                </Button>

                <Button
  href="/standings"
  variant="secondary"
  fullWidth
>
                  Gironi
                </Button>
              </div>
            </SantosCard>

            <div>
              <h2 className="text-2xl font-black text-[#062B55]">
                QR giocatori
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Accessi personali per il check-in
              </p>
            </div>

            <div className="space-y-4">
              {currentTeamPlayers.map((player) => (
                <PlayerQrCard
                  key={player.id}
                  player={player}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </AppShell>
    </ProtectedRoute>
  );
}