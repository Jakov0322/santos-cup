"use client";

import { useState } from "react";

export function InstallBanner() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="rounded-3xl bg-[#062B55] p-5 text-white shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black">
            Installa Santos Cup
          </p>

          <p className="mt-2 text-sm leading-6 text-cyan-100">
            Aggiungi l'app alla schermata home per
            seguire il torneo live.
          </p>
        </div>

        <button
          onClick={() => setHidden(true)}
          className="text-cyan-200"
        >
          ✕
        </button>
      </div>

      <button className="mt-5 w-full rounded-2xl bg-[#00C8E8] px-4 py-4 font-black text-[#031A33]">
        Installa app
      </button>
    </div>
  );
}