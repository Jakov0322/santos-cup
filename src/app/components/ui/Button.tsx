import { cn } from "@/app/lib/utils/cn";
import { LoadingSpinner } from "./LoadingSpinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  loading?: boolean;
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  onClick,
  href,
  className,
  loading = false,
}: ButtonProps) {
  const styles = cn(
    "rounded-3xl px-5 py-4 text-center font-black transition active:scale-[0.98]",

    {
      "bg-[#00C8E8] text-[#031A33]":
        variant === "primary",

      "border border-slate-200 bg-white text-[#062B55]":
        variant === "secondary",

      "bg-red-600 text-white":
        variant === "danger",

      "bg-green-600 text-white":
        variant === "success",

      "w-full": fullWidth,
    },

    className
  );

if (href) {
  return (
    <a href={href} className={styles}>
      {loading ? <LoadingSpinner /> : children}
    </a>
  );
}

return (
  <button onClick={onClick} className={styles}>
    {loading ? <LoadingSpinner /> : children}
  </button>
);
    }