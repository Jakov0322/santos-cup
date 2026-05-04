export type PlayerStat = {
  id: string;
  playerName: string;
  teamName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};

export const playerStats: PlayerStat[] = [
  {
    id: "stat-1",
    playerName: "Luca Bianchi",
    teamName: "Santos FC",
    goals: 5,
    assists: 2,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: "stat-2",
    playerName: "Marco Verdi",
    teamName: "Blue Sharks",
    goals: 4,
    assists: 1,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: "stat-3",
    playerName: "Davide Neri",
    teamName: "Real Amigos",
    goals: 3,
    assists: 3,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: "stat-4",
    playerName: "Andrea Gallo",
    teamName: "Golden Boys",
    goals: 2,
    assists: 0,
    yellowCards: 2,
    redCards: 1,
  },
];