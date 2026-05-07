"use client";

import { useState } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import { AppShell } from "../components/layout/AppShell";
import { toast } from "sonner";

export default function LoginPage() {
  const { user, isAdmin, signIn, signOut, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Login effettuato");
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center pt-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00C8E8] border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (user) {
    return (
      <AppShell>
        <section className="space-y-5 pt-6">
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062B55] to-[#031A33] p-6 text-white shadow-2xl">
            <p className="text-sm text-cyan-200">Account</p>
            <h1 className="mt-2 text-3xl font-black">{user.email}</h1>
            {isAdmin && (
              <span className="mt-3 inline-block rounded-full bg-[#00C8E8] px-3 py-1 text-xs font-black text-[#031A33]">
                ADMIN
              </span>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="w-full rounded-3xl border border-red-200 bg-white px-5 py-4 font-black text-red-600"
          >
            Logout
          </button>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="space-y-5 pt-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#062B55] text-3xl text-white shadow-2xl">
            ⚽
          </div>
          <h1 className="mt-4 text-3xl font-black text-[#062B55]">Login</h1>
          <p className="mt-1 text-sm text-slate-500">
            Accedi per gestire il torneo
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-bold text-[#062B55]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00C8E8] focus:outline-none"
              placeholder="admin@santoscup.it"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#062B55]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#00C8E8] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-3xl bg-[#00C8E8] px-5 py-4 font-black text-[#031A33] disabled:opacity-50"
          >
            {submitting ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </section>
    </AppShell>
  );
}
