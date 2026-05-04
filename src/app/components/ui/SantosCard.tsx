type SantosCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SantosCard({ children, className = "" }: SantosCardProps) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}