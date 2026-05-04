export function LivePulse() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />

        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
      </div>

      <span className="text-xs font-black tracking-wide text-red-500">
        LIVE
      </span>
    </div>
  );
}