"use client";

import { useCallback, useState } from "react";

const TEAMS_KEY = "santos_fav_teams";
const PLAYERS_KEY = "santos_fav_players";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function useFavourites() {
  const [favouriteTeams, setFavouriteTeams] = useState<string[]>(() => readList(TEAMS_KEY));
  const [favouritePlayers, setFavouritePlayers] = useState<string[]>(() => readList(PLAYERS_KEY));

  const toggleTeam = useCallback((id: string) => {
    setFavouriteTeams((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
      writeList(TEAMS_KEY, next);
      return next;
    });
  }, []);

  const togglePlayer = useCallback((id: string) => {
    setFavouritePlayers((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      writeList(PLAYERS_KEY, next);
      return next;
    });
  }, []);

  const isTeamFav = useCallback(
    (id: string) => favouriteTeams.includes(id),
    [favouriteTeams]
  );

  const isPlayerFav = useCallback(
    (id: string) => favouritePlayers.includes(id),
    [favouritePlayers]
  );

  return {
    favouriteTeams,
    favouritePlayers,
    toggleTeam,
    togglePlayer,
    isTeamFav,
    isPlayerFav,
    hasFavourites: favouriteTeams.length > 0 || favouritePlayers.length > 0,
  };
}
