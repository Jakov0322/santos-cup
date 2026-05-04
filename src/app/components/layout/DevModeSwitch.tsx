"use client";

import { useAuthStore } from "@/app/lib/store/auth-store";
import { USER_ROLES } from "@/app/lib/constants/tournament";

export function DevModeSwitch() {
  const user = useAuthStore((state) => state.user);
  const loginAsAdmin = useAuthStore((state) => state.loginAsAdmin);
  const loginAsCaptain = useAuthStore((state) => state.loginAsCaptain);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <div className="fixed right-4 top-4 z-[9999] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
      <button
        onClick={() => {
          if (isAdmin) {
            loginAsCaptain();
          } else {
            loginAsAdmin();
          }
        }}
        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-black ${
          isAdmin
            ? "bg-[#062B55] text-white"
            : "bg-slate-100 text-[#062B55]"
        }`}
      >
        <span
          className={`h-3 w-3 rounded-full ${
            isAdmin ? "bg-green-400" : "bg-slate-400"
          }`}
        />

        {isAdmin ? "ADMIN MODE" : "USER MODE"}
      </button>
    </div>
  );
}