import { Team } from "@/app/types/database";

type TeamStatusCardProps = {
  team: Team;
};

export function TeamStatusCard({ team }: TeamStatusCardProps) {
  const isConfirmed = team.paymentStatus === "confirmed";

  return (
    <div className="rounded-[32px] bg-[#062B55] p-6 text-white shadow-xl">
      <p className="text-sm font-bold text-cyan-200">
        Area squadra
      </p>

      <h1 className="mt-2 text-4xl font-black tracking-tight">
        {team.name}
      </h1>

      <p className="mt-2 text-sm text-cyan-100">
        Capitano: {team.captainName}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs text-cyan-100">Pacchetto</p>
          <p className="mt-1 text-lg font-black uppercase">
            {team.packageType}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs text-cyan-100">Pagamento</p>
          <p
            className={`mt-1 text-lg font-black ${
              isConfirmed ? "text-green-300" : "text-amber-300"
            }`}
          >
            {isConfirmed ? "Confermato" : "Da verificare"}
          </p>
        </div>
      </div>
    </div>
  );
}