import { AdminPaymentCard } from "../components/admin/AdminPaymentCard";
import { AdminStatCard } from "../components/admin/AdminStatCard";
import { AppShell } from "../components/layout/AppShell";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { Button } from "../components/ui/Button";
import { MATCH_STATUSES, PAYMENT_STATUSES } from "../lib/constants/tournament";
import {
  mockRegistrations,
  mockTeams,
  mockTournamentMatches,
} from "../lib/tournament/mock";

export default function AdminPage() {
  const confirmedTeams = mockTeams.filter(
    (team) => team.paymentStatus === PAYMENT_STATUSES.CONFIRMED
  );

  const pendingPayments = mockRegistrations.filter(
    (registration) =>
      registration.paymentStatus === PAYMENT_STATUSES.PENDING ||
      registration.paymentStatus === PAYMENT_STATUSES.RECEIPT_UPLOADED
  );

  const liveMatches = mockTournamentMatches.filter(
    (match) => match.status === MATCH_STATUSES.LIVE
  );

  return (
     <ProtectedRoute allowedRoles={["admin"]}>
    <AppShell showBottomNav={false}>
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-[#062B55]">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Gestione torneo Santos Cup
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AdminStatCard
            title="Squadre"
            value={mockTeams.length}
            subtitle={`${confirmedTeams.length} confermate`}
          />

          <AdminStatCard
            title="Live"
            value={liveMatches.length}
            subtitle="Partite in corso"
          />

          <AdminStatCard
            title="Pagamenti"
            value={pendingPayments.length}
            subtitle="Da verificare"
          />

          <AdminStatCard
            title="Partite"
            value={mockTournamentMatches.length}
            subtitle="Programmate"
          />
        </div>

        <div className="grid gap-3">
          <Button
            href="/admin/tournament"
            variant="secondary"
            fullWidth
          >
          Genera torneo
          </Button>
          <Button
            href="/admin/matches"
            variant="primary"
            fullWidth 
          >
            Gestisci partite
          </Button>

          <Button
            href="/admin/payments"
            variant="secondary"
            fullWidth
          >
            Gestisci pagamenti
          </Button>

          <Button
            href="/admin/teams"
            variant="secondary"
            fullWidth
          >
            Gestisci squadre
          </Button>

          <Button
            href="/admin/checkin"
            variant="secondary"
            fullWidth
          >
            Check-in QR
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-[#062B55]">
              Pagamenti da verificare
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Conferma o rifiuta le richieste iscrizione
            </p>
          </div>

          {pendingPayments.map((registration) => (
            <AdminPaymentCard
              key={registration.id}
              registration={registration}
            />
          ))}
        </div>
      </section>
    </AppShell>
    </ProtectedRoute>
  );
}