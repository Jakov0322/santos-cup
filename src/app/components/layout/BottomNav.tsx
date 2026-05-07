const navItems = [
  {
    label: "Partite",
    href: "/matches",
    icon: "⚽",
  },
  {
    label: "Tabellone",
    href: "/bracket",
    icon: "🏆",
  },
  {
    label: "Squadre",
    href: "/teams",
    icon: "👥",
  },
  {
    label: "Statistiche",
    href: "/stats",
    icon: "📊",
  },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 px-2 py-3"
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="text-[11px] font-bold text-[#062B55]">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}