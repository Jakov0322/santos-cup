type PaymentMethodCardProps = {
  title: string;
  children: React.ReactNode;
};

export function PaymentMethodCard({
  title,
  children,
}: PaymentMethodCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-[#062B55]">
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}