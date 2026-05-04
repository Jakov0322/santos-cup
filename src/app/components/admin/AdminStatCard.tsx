type AdminStatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function AdminStatCard({
  title,
  value,
  subtitle,
}: AdminStatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-[#062B55]">
        {value}
      </p>

      {subtitle ? (
        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}