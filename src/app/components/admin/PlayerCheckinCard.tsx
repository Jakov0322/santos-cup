"use client";

import { useState } from "react";

type PlayerCheckinCardProps = {
  playerName: string;
  teamName: string;
  shirtNumber: number;
  initialCheckedIn: boolean;
};

export function PlayerCheckinCard({
  playerName,
  teamName,
  shirtNumber,
  initialCheckedIn,
}: PlayerCheckinCardProps) {
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#062B55] text-xl font-black text-white">
          {shirtNumber}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-black text-[#062B55]">
            {playerName}
          </h2>

          <p className="truncate text-sm text-slate-500">
            {teamName}
          </p>
        </div>

        <div>
          {checkedIn ? (
            <span className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
              CHECKED-IN
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
              PENDING
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setCheckedIn(true)}
          className="rounded-2xl bg-green-600 px-4 py-4 font-bold text-white"
        >
          Conferma ingresso
        </button>

        <button
          onClick={() => setCheckedIn(false)}
          className="rounded-2xl bg-red-600 px-4 py-4 font-bold text-white"
        >
          Rimuovi
        </button>
      </div>
    </div>
  );
}