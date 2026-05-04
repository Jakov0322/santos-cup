"use client";

import { AppShell } from "../components/layout/AppShell";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../lib/store/auth-store";

export default function LoginPage() {
  const loginAsAdmin =
    useAuthStore(
      (state) => state.loginAsAdmin
    );

  const loginAsCaptain =
    useAuthStore(
      (state) => state.loginAsCaptain
    );

  return (
    <AppShell showBottomNav={false}>
      <section className="space-y-5 pt-10">
        <div className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#062B55] text-5xl text-white shadow-2xl">
            ⚽
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-[#062B55]">
            Santos Cup
          </h1>

          <p className="mt-3 text-slate-500">
            Mock authentication system
          </p>
        </div>

        <div className="space-y-4 rounded-[32px] bg-white p-6 shadow-sm border border-slate-200">
          <button
            onClick={() => {
              authService.loginAsCaptain();
              window.location.href =
                "/dashboard";
            }}
            className="w-full rounded-3xl bg-[#00C8E8] px-5 py-5 text-lg font-black text-[#031A33]"
          >
            Login Capitano
          </button>

          <button
            onClick={() => {
              authService.loginAsAdmin();
              window.location.href =
                "/admin";
            }}
            className="w-full rounded-3xl bg-[#062B55] px-5 py-5 text-lg font-black text-white"
          >
            Login Admin
          </button>
        </div>
      </section>
    </AppShell>
  );
}