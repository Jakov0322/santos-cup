import {
  MatchStatus,
  PackageType,
  PaymentStatus,
} from "../lib/constants/types";

export interface Team {
  id: string;
  name: string;
  captainName: string;
  captainEmail: string;
  captainPhone: string;
  packageType: PackageType;
  paymentStatus: PaymentStatus;
}

export interface Player {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  shirtNumber: number;
  checkedIn: boolean;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  field: number;
  startsAt: string;
  status: MatchStatus;
  phase: string;
}

export interface StandingRow {
  team: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export type { PaymentStatus };
