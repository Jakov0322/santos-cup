"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/app/components/layout/AppShell";

import { supabase } from "@/app/lib/supabase/client";

type Team = {
  id: string;
  name: string;
  captain_name: string;
};

export default function SupabaseTestPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTeams() {
      const { data, error } =
        await supabase
          .from("teams")
          .select("*");

      if (error) {
        console.error(error);

        setError(error.message);

        setLoading(false);

        return;
      }

      setTeams(data || []);

      setLoading(false);
    }

    loadTeams();
  }, []);

  async function createTestTeam() {
    const { error } =
      await supabase
        .from("teams")
        .insert({
          name:
            "Test Team " +
            Math.floor(
              Math.random() * 1000
            ),

          captain_name:
            "Mario Rossi",

          captain_email:
            "test@test.com",

          captain_phone:
            "+39 3330000000",
        });

    if (error) {
      console.error(error);

      return;
    }

    window.location.reload();
  }

  return (
    <AppShell showBottomNav={false}>
      <section className="space-y-5 pt-5">
        <div>
          <h1 className="text-3xl font-black text-[#062B55]">
            Supabase Test
          </h1>

          <p className="mt-1 text-slate-500">
            Connessione database reale
          </p>
        </div>

        <button
          onClick={createTestTeam}
          className="w-full rounded-3xl bg-[#00C8E8] px-5 py-5 text-lg font-black text-[#031A33]"
        >
          Inserisci team test
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {loading ? (
            <p className="font-semibold text-slate-500">
              Loading...
            </p>
          ) : error ? (
            <p className="font-semibold text-red-600">
              {error}
            </p>
          ) : teams.length === 0 ? (
            <p className="font-semibold text-slate-500">
              Nessun team presente
            </p>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <p className="font-black text-[#062B55]">
                    {team.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {team.captain_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}