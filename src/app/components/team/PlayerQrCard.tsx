import { Player } from "@/app/types/database";

type PlayerQrCardProps = {
  player: Player;
};

export function PlayerQrCard({ player }: PlayerQrCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#062B55] text-xl font-black text-white">
          {player.shirtNumber}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black text-[#062B55]">
            {player.firstName} {player.lastName}
          </p>

          <p className="text-sm text-slate-500">
            QR ingresso personale
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-slate-100 text-center text-xs font-bold text-slate-500">
          QR-{player.id}
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Mostra questo QR allo staff per il check-in all’ingresso.
      </p>
    </div>
  );
}