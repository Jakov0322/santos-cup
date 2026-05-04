import { PaymentStatus } from "@/app/lib/constants/types";

import { PAYMENT_STATUSES } from "@/app/lib/constants/tournament";

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
};

export function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  if (status === PAYMENT_STATUSES.CONFIRMED) {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
        Confermato
      </span>
    );
  }

  if (status === PAYMENT_STATUSES.RECEIPT_UPLOADED) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
        In verifica
      </span>
    );
  }

  if (status === PAYMENT_STATUSES.REJECTED) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
        Rifiutato
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      In attesa
    </span>
  );
}