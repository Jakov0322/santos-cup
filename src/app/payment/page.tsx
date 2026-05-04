"use client";

import { AppShell } from "../components/layout/AppShell";
import { PaymentMethodCard } from "../components/payment/PaymentMethodCard";
import { ReceiptUpload } from "../components/payment/ReceiptUpload";
import { Button } from "../components/ui/Button";
import { SectionTitle } from "../components/ui/SectionTitle";
import { toast } from "sonner";

export default function PaymentPage() {
  const handleComplete = () => {
    toast.success(
  "Pagamento inviato correttamente"
);
    window.location.href = "/dashboard";
  };

  return (
    <AppShell>
      <section className="space-y-5">
        <SectionTitle
          title="Pagamento"
          subtitle="Completa il pagamento per confermare l’iscrizione"
        />

        <PaymentMethodCard title="Satispay">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-slate-100 text-center text-sm text-slate-500">
                QR CODE SATISPAY
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Causale</p>
              <p className="font-bold text-[#062B55]">
                SANTOS CUP - Nome Squadra
              </p>
            </div>
          </div>
        </PaymentMethodCard>

        <PaymentMethodCard title="PayPal">
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">PayPal</p>
              <p className="font-bold text-[#062B55]">paypal.me/tuolink</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Causale</p>
              <p className="font-bold text-[#062B55]">
                SANTOS CUP - Nome Squadra
              </p>
            </div>
          </div>
        </PaymentMethodCard>

        <PaymentMethodCard title="Bonifico">
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Intestatario</p>
              <p className="font-bold text-[#062B55]">Mario Rossi</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">IBAN</p>
              <p className="break-all font-bold text-[#062B55]">
                IT00X0000000000000000000000
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Causale</p>
              <p className="font-bold text-[#062B55]">
                SANTOS CUP - Nome Squadra
              </p>
            </div>
          </div>
        </PaymentMethodCard>

        <PaymentMethodCard title="Ricevuta">
          <ReceiptUpload />
        </PaymentMethodCard>

        <Button onClick={handleComplete} fullWidth>
          Invia richiesta iscrizione
        </Button>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            L’iscrizione sarà confermata dopo la verifica manuale del pagamento
            da parte dello staff Santos Cup.
          </p>
        </div>
      </section>
    </AppShell>
  );
}