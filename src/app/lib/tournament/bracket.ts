export type BracketMatch = {
  id: string;
  round: "Quarti" | "Semifinali" | "Finale";
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "live" | "finished";
  startsAt: string;
  field: number;
};

export const bracketMatches: BracketMatch[] = [
  {
    id: "qf-1",
    round: "Quarti",
    homeTeam: "1ª Girone A",
    awayTeam: "2ª Girone B",
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    startsAt: "18:00",
    field: 1,
  },
  {
    id: "qf-2",
    round: "Quarti",
    homeTeam: "1ª Girone B",
    awayTeam: "2ª Girone A",
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    startsAt: "18:00",
    field: 2,
  },
  {
    id: "sf-1",
    round: "Semifinali",
    homeTeam: "Vincente QF1",
    awayTeam: "Vincente QF2",
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    startsAt: "20:00",
    field: 1,
  },
  {
    id: "final",
    round: "Finale",
    homeTeam: "Vincente SF1",
    awayTeam: "Vincente SF2",
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    startsAt: "21:30",
    field: 1,
  },
];