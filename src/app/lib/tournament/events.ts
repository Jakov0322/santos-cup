export type MatchEventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "start"
  | "end";

export type MatchEvent = {
  id: string;
  minute: number;
  type: MatchEventType;
  playerName?: string;
  teamName: string;
};

export const mockMatchEvents: MatchEvent[] = [
  {
    id: "1",
    minute: 1,
    type: "start",
    teamName: "SYSTEM",
  },
  {
    id: "2",
    minute: 4,
    type: "goal",
    playerName: "Luca Bianchi",
    teamName: "Santos FC",
  },
  {
    id: "3",
    minute: 9,
    type: "yellow_card",
    playerName: "Marco Verdi",
    teamName: "Blue Sharks",
  },
  {
    id: "4",
    minute: 14,
    type: "goal",
    playerName: "Davide Neri",
    teamName: "Blue Sharks",
  },
];