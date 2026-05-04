export type MatchEventType =
  | "goal"
  | "yellow_card"
  | "red_card";

export type MatchEvent = {
  id: string;

  matchId: string;

  minute: number;

  type: MatchEventType;

  playerName: string;

  teamName: string;

  createdAt: string;
};