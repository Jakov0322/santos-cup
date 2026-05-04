"use client";

import {
  MockRegistration,
} from "@/app/lib/tournament/mock";

import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { teamService } from "@/app/services/team-service";
import { useTournamentStore } from "@/app/lib/store/tournament-store";
import { toast } from "sonner";

type AdminPaymentCardProps = {
  registration: MockRegistration;
};

export function AdminPaymentCard({
  registration,
}: AdminPaymentCardProps) {
  const teams = useTournamentStore(
    (state) => state.teams
  );

  const confirmTeamPayment =
    useTournamentStore(
      (state) => state.confirmTeamPayment
    );

  const team = teams.find(
    (t) => t.id === registration.teamId
  );

  if (!team) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#062B55]">
            {team.name}
          </h2>

          <p className="text-sm text-slate-500">
            {team.captainName}
          </p>
        </div>

        <PaymentStatusBadge
          status={team.paymentStatus}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">
            Pacchetto
          </p>

          <p className="font-bold text-[#062B55]">
            {registration.selectedPackage}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">
            Pagamento
          </p>

          <p className="font-bold text-[#062B55]">
            {registration.paymentMethod}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
         onClick={() => {
  teamService.confirmPayment(team.id);

  toast.success(
    "Pagamento confermato"
  );
}}
          className="flex-1 rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white"
        >
          Conferma
        </button>

        <button className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white">
          Rifiuta
        </button>
      </div>
    </div>
  );
}