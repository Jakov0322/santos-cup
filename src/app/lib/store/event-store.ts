"use client";

import { create } from "zustand";

import {
  MatchEvent,
  MatchEventType,
} from "@/app/types/events";

import { useTournamentStore } from "./tournament-store";

type EventStore = {
  events: MatchEvent[];

  addEvent: (
    matchId: string,
    minute: number,
    type: MatchEventType,
    playerName: string,
    teamName: string
  ) => void;

  getMatchEvents: (matchId: string) => MatchEvent[];
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],

  addEvent: (matchId, minute, type, playerName, teamName) => {
    const newEvent: MatchEvent = {
      id: crypto.randomUUID(),
      matchId,
      minute,
      type,
      playerName,
      teamName,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      events: [newEvent, ...state.events],
    }));

    if (type === "goal") {
      const match = useTournamentStore
        .getState()
        .matches.find((m) => m.id === matchId);

      if (!match) return;

      const isHomeGoal = match.homeTeam === teamName;

      useTournamentStore.getState().updateMatch(
        matchId,
        isHomeGoal ? match.homeScore + 1 : match.homeScore,
        isHomeGoal ? match.awayScore : match.awayScore + 1,
        match.status
      );
    }
  },

  getMatchEvents: (matchId) =>
    get()
      .events.filter((event) => event.matchId === matchId)
      .sort((a, b) => b.minute - a.minute),
}));