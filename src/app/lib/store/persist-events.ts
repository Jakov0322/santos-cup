"use client";

import { useEffect } from "react";

import { useEventStore } from "./event-store";

export function usePersistEvents() {
  const store = useEventStore();

  useEffect(() => {
    const saved = localStorage.getItem(
      "santos-events"
    );

    if (saved) {
      const parsed = JSON.parse(saved);

      useEventStore.setState(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "santos-events",
      JSON.stringify(store)
    );
  }, [store]);
}