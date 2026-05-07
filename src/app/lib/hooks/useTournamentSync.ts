"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { syncTournament } from "@/app/lib/api";

/**
 * Runs auto-finalization + knockout generation once per page load
 * when the current user is an admin.
 */
export function useTournamentSync() {
  const { isAdmin } = useAuth();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!isAdmin || ranRef.current) return;
    ranRef.current = true;
    syncTournament().catch(() => {});
  }, [isAdmin]);
}
