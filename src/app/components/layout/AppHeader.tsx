type AppHeaderProps = {
  title: string;
  subtitle?: string;
  live?: boolean;
};

export function AppHeader({
  title,
  subtitle,
  live = false,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 -mx-4 mb-5 border-b border-white/10 bg-[#062B55]/95 px-4 pb-5 pt-5 backdrop-blur">
      <div className="mx-auto max-w-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-1 text-sm text-cyan-100">
                {subtitle}
              </p>
            ) : null}
          </div>

          {live ? (
            <div className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-2 text-xs font-black text-white shadow-lg">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}