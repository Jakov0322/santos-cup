type EmptyStateProps = {
  title: string;
  subtitle?: string;
  icon?: string;
};

export function EmptyState({
  title,
  subtitle,
  icon = "📭",
}: EmptyStateProps) {
  return (
    <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="text-5xl">
        {icon}
      </div>

      <h2 className="mt-5 text-2xl font-black text-[#062B55]">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}