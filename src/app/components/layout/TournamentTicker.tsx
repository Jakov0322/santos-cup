"use client";

import { useLiveMinute } from "@/app/lib/hooks/useLiveMinute";

export function TournamentTicker() {
  const minute = useLiveMinute(1);

  return (
    <div className="-mx-4 mb-5 overflow-hidden bg-[#031A33] py-2">
      <div className="animate-marquee whitespace-nowrap text-sm font-bold text-cyan-200">
        ⚽ Santos FC 2-1 Blue Sharks · LIVE {minute}'
        &nbsp;&nbsp;&nbsp;🏆 Santos Cup · 2 campi
        attivi · 16 squadre · LIVE NOW
      </div>
    </div>
  );
}