import { Match } from "@/app/types/database";
import { MATCH_STATUSES } from "@/app/lib/constants/tournament";

export type LiveStandingRow = {
  team: string;
  position: number;
  previousPosition: number;
  positionDelta: number;

  played: number;
  won: number;
  draw: number;
  lost: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;

  points: number;
  previousPoints: number;
  pointsDelta: number;

  liveScore?: {
    for: number;
    against: number;
    result: "winning" | "drawing" | "losing";
  };
};

function createEmptyRow(team: string): LiveStandingRow {
  return {
    team,
    position: 0,
    previousPosition: 0,
    positionDelta: 0,

    played: 0,
    won: 0,
    draw: 0,
    lost: 0,

    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,

    points: 0,
    previousPoints: 0,
    pointsDelta: 0,
  };
}

function applyMatch(
  table: Map<string, LiveStandingRow>,
  match: Match,
  includeLiveScore: boolean
) {
  const home =
    table.get(match.homeTeam) ?? createEmptyRow(match.homeTeam);

  const away =
    table.get(match.awayTeam) ?? createEmptyRow(match.awayTeam);

  home.played += 1;
  away.played += 1;

  home.goalsFor += match.homeScore;
  home.goalsAgainst += match.awayScore;

  away.goalsFor += match.awayScore;
  away.goalsAgainst += match.homeScore;

  if (match.homeScore > match.awayScore) {
    home.won += 1;
    away.lost += 1;
    home.points += 3;
  } else if (match.homeScore < match.awayScore) {
    away.won += 1;
    home.lost += 1;
    away.points += 3;
  } else {
    home.draw += 1;
    away.draw += 1;
    home.points += 1;
    away.points += 1;
  }

  home.goalDifference = home.goalsFor - home.goalsAgainst;
  away.goalDifference = away.goalsFor - away.goalsAgainst;

  if (includeLiveScore) {
    home.liveScore = {
      for: match.homeScore,
      against: match.awayScore,
      result:
        match.homeScore > match.awayScore
          ? "winning"
          : match.homeScore === match.awayScore
            ? "drawing"
            : "losing",
    };

    away.liveScore = {
      for: match.awayScore,
      against: match.homeScore,
      result:
        match.awayScore > match.homeScore
          ? "winning"
          : match.awayScore === match.homeScore
            ? "drawing"
            : "losing",
    };
  }

  table.set(home.team, home);
  table.set(away.team, away);
}

function sortRows(rows: LiveStandingRow[]) {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }

    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    return a.team.localeCompare(b.team);
  });
}

function assignPositions(rows: LiveStandingRow[]) {
  return rows.map((row, index) => ({
    ...row,
    position: index + 1,
  }));
}

export function calculateLiveStandings(matches: Match[]) {
  const teams = Array.from(
    new Set(matches.flatMap((match) => [match.homeTeam, match.awayTeam]))
  );

  const baseTable = new Map<string, LiveStandingRow>();

  teams.forEach((team) => {
    baseTable.set(team, createEmptyRow(team));
  });

  matches
    .filter((match) => match.status === MATCH_STATUSES.FINISHED)
    .forEach((match) => applyMatch(baseTable, match, false));

  const baseRows = assignPositions(sortRows(Array.from(baseTable.values())));

  const projectedTable = new Map<string, LiveStandingRow>();

  baseRows.forEach((row) => {
    projectedTable.set(row.team, {
      ...row,
      previousPosition: row.position,
      previousPoints: row.points,
    });
  });

  matches
    .filter((match) => match.status === MATCH_STATUSES.LIVE)
    .forEach((match) => applyMatch(projectedTable, match, true));

  const projectedRows = assignPositions(
    sortRows(Array.from(projectedTable.values()))
  );

  return projectedRows.map((row) => ({
    ...row,
    positionDelta: row.previousPosition - row.position,
    pointsDelta: row.points - row.previousPoints,
  }));
}