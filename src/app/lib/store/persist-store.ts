"use client";

import { useEffect } from "react";

import { useTournamentStore } from "./tournament-store";

export function usePersistStore() {
  const store = useTournamentStore();

  useEffect(() => {
    const saved = localStorage.getItem(
      "santos-cup-store"
    );

    if (saved) {
      const parsed = JSON.parse(saved);

      useTournamentStore.setState(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "santos-cup-store",
      JSON.stringify(store)
    );
  }, [store]);
}