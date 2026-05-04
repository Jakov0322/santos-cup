import { useTournamentStore } from "../lib/store/tournament-store";

export const matchService = {
  getMatches() {
    return useTournamentStore.getState().matches;
  },

  updateMatch(
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: "scheduled" | "live" | "finished"
  ) {
    useTournamentStore
      .getState()
      .updateMatch(
        matchId,
        homeScore,
        awayScore,
        status
      );
  },
};