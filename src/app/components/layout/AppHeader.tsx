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

          <div className="flex items-center gap-3">
            {live ? (
              <div className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-2 text-xs font-black text-white shadow-lg">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            ) : null}

            <a
              href="/login"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Account"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}