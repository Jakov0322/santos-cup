import clsx from "clsx";

type StatusBadgeVariant =
  | "live"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

type StatusBadgeProps = {
  children: React.ReactNode;
  variant?: StatusBadgeVariant;
};

export function StatusBadge({
  children,
  variant = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-bold",

        {
          "bg-red-100 text-red-700":
            variant === "live",

          "bg-green-100 text-green-700":
            variant === "success",

          "bg-amber-100 text-amber-700":
            variant === "warning",

          "bg-slate-100 text-slate-700":
            variant === "neutral",

          "bg-red-600 text-white":
            variant === "danger",
        }
      )}
    >
      {children}
    </span>
  );
}