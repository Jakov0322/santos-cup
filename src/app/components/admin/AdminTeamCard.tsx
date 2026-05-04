import { Team } from "@/app/types/database";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

type AdminTeamCardProps = {
  team: Team;
};

export function AdminTeamCard({
  team,
}: AdminTeamCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#062B55]">
            {team.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
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
            {team.packageType}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">
            Telefono
          </p>

          <p className="font-bold text-[#062B55]">
            {team.captainPhone}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="rounded-2xl bg-[#062B55] px-4 py-4 font-bold text-white">
          Modifica
        </button>

        <button className="rounded-2xl bg-red-600 px-4 py-4 font-bold text-white">
          Elimina
        </button>
      </div>
    </div>
  );
}