"use client";

import { useEffect } from "react";

import { useAuthStore } from "./auth-store";

export function usePersistAuth() {
  const store = useAuthStore();

  useEffect(() => {
    const saved = localStorage.getItem(
      "santos-auth"
    );

    if (saved) {
      const parsed = JSON.parse(saved);

      useAuthStore.setState(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "santos-auth",
      JSON.stringify(store)
    );
  }, [store]);
}