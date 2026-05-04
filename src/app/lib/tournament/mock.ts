import {
  Match,
  PaymentStatus,
  Player,
  Team
} from "@/app/types/database";
import { PAYMENT_STATUSES, MATCH_STATUSES, PACKAGE_TYPES } from "../constants/tournament";

export type MockPaymentMethod = "satispay" | "paypal" | "bank_transfer";

export type MockRegistration = {
  id: string;
  teamId: string;
  selectedPackage: "basic" | "lunch" | "full";
  paymentMethod: MockPaymentMethod;
  paymentStatus: PaymentStatus;
  receiptUrl?: string;
  createdAt: string;
};

export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Santos FC",
    captainName: "Luca Bianchi",
    captainEmail: "luca@santos.test",
    captainPhone: "+39 333 1111111",
    packageType: PACKAGE_TYPES.FULL,
    paymentStatus: PAYMENT_STATUSES.CONFIRMED,
  },
  {
    id: "team-2",
    name: "Blue Sharks",
    captainName: "Marco Verdi",
    captainEmail: "marco@sharks.test",
    captainPhone: "+39 333 2222222",
    packageType: PACKAGE_TYPES.BASIC,
    paymentStatus: PAYMENT_STATUSES.CONFIRMED,
  },
  {
    id: "team-3",
    name: "Real Amigos",
    captainName: "Davide Neri",
    captainEmail: "davide@amigos.test",
    captainPhone: "+39 333 3333333",
    packageType: PACKAGE_TYPES.BASIC,
    paymentStatus: PAYMENT_STATUSES.RECEIPT_UPLOADED,
  },
  {
    id: "team-4",
    name: "Golden Boys",
    captainName: "Andrea Gallo",
    captainEmail: "andrea@golden.test",
    captainPhone: "+39 333 4444444",
    packageType: PACKAGE_TYPES.FULL,
    paymentStatus: PAYMENT_STATUSES.PENDING,
  },
];

export const mockPlayers: Player[] = [
  {
    id: "player-1",
    teamId: "team-1",
    firstName: "Luca",
    lastName: "Bianchi",
    shirtNumber: 10,
    checkedIn: true,
  },
  {
    id: "player-2",
    teamId: "team-1",
    firstName: "Matteo",
    lastName: "Rossi",
    shirtNumber: 7,
    checkedIn: true,
  },
  {
    id: "player-3",
    teamId: "team-2",
    firstName: "Marco",
    lastName: "Verdi",
    shirtNumber: 9,
    checkedIn: false,
  },
];

export const mockRegistrations: MockRegistration[] = [
  {
    id: "registration-1",
    teamId: "team-1",
    selectedPackage: "full",
    paymentMethod: "satispay",
    paymentStatus: PAYMENT_STATUSES.CONFIRMED,
    receiptUrl: "/mock/receipt-santos.png",
    createdAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "registration-2",
    teamId: "team-2",
    selectedPackage: "lunch",
    paymentMethod: "paypal",
    paymentStatus: PAYMENT_STATUSES.CONFIRMED,
    receiptUrl: "/mock/receipt-sharks.png",
    createdAt: "2026-05-01T10:20:00.000Z",
  },
  {
    id: "registration-3",
    teamId: "team-3",
    selectedPackage: "basic",
    paymentMethod: "bank_transfer",
    paymentStatus: PAYMENT_STATUSES.RECEIPT_UPLOADED,
    receiptUrl: "/mock/receipt-amigos.pdf",
    createdAt: "2026-05-01T11:00:00.000Z",
  },
  {
    id: "registration-4",
    teamId: "team-4",
    selectedPackage: "full",
    paymentMethod: "satispay",
    paymentStatus: PAYMENT_STATUSES.PENDING,
    createdAt: "2026-05-01T11:30:00.000Z",
  },
];

export const mockTournamentMatches: Match[] = [
  {
    id: "match-1",
    homeTeam: "Santos FC",
    awayTeam: "Blue Sharks",
    homeScore: 2,
    awayScore: 1,
    field: 1,
    startsAt: "10:00",
    status: MATCH_STATUSES.LIVE,
    phase: "Girone A",
  },
  {
    id: "match-2",
    homeTeam: "Real Amigos",
    awayTeam: "Golden Boys",
    homeScore: 0,
    awayScore: 0,
    field: 2,
    startsAt: "10:00",
    status: MATCH_STATUSES.SCHEDULED,
    phase: "Girone A",
  },
  {
    id: "match-3",
    homeTeam: "Santos FC",
    awayTeam: "Real Amigos",
    homeScore: 0,
    awayScore: 0,
    field: 1,
    startsAt: "10:30",
    status: MATCH_STATUSES.SCHEDULED,
    phase: "Girone A",
  },
  {
    id: "match-4",
    homeTeam: "Blue Sharks",
    awayTeam: "Golden Boys",
    homeScore: 0,
    awayScore: 0,
    field: 2,
    startsAt: "10:30",
    status: "scheduled",
    phase: "Girone A",
  },
];