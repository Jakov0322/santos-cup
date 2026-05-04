type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-[#062B55]">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}