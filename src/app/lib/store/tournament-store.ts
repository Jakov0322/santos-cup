"use client";

import { create } from "zustand";

import {
  mockTeams,
  mockTournamentMatches,
  mockPlayers,
  mockRegistrations,
} from "../tournament/mock";

import { Match, Player, Team } from "@/app/types/database";

type TournamentStore = {
  teams: Team[];
  players: Player[];
  matches: Match[];

  confirmTeamPayment: (teamId: string) => void;

  updateMatch: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: Match["status"]
  ) => void;

  togglePlayerCheckin: (
    playerId: string,
    checkedIn: boolean
  ) => void;
};

export const useTournamentStore =
  create<TournamentStore>((set) => ({
    teams: mockTeams,

    players: mockPlayers,

    matches: mockTournamentMatches,

    confirmTeamPayment: (teamId) =>
      set((state) => ({
        teams: state.teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                paymentStatus: "confirmed",
              }
            : team
        ),
      })),

    updateMatch: (
      matchId,
      homeScore,
      awayScore,
      status
    ) =>
      set((state) => ({
        matches: state.matches.map((match) =>
          match.id === matchId
            ? {
                ...match,
                homeScore,
                awayScore,
                status,
              }
            : match
        ),
      })),

    togglePlayerCheckin: (
      playerId,
      checkedIn
    ) =>
      set((state) => ({
        players: state.players.map((player) =>
          player.id === playerId
            ? {
                ...player,
                checkedIn,
              }
            : player
        ),
      })),
  }));