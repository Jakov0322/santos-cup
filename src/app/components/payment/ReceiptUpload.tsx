"use client";

import { useState } from "react";

export function ReceiptUpload() {
  const [fileName, setFileName] = useState("");

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#062B55]">
        Carica ricevuta pagamento
      </label>

      <label className="flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 transition hover:border-[#00C8E8]">
        <div className="text-center">
          <p className="font-semibold text-[#062B55]">
            {fileName || "Seleziona immagine o screenshot"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            PNG, JPG o PDF
          </p>
        </div>

        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setFileName(file.name);
            }
          }}
        />
      </label>
    </div>
  );
}