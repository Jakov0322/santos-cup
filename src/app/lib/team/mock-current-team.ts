import { Player, Team } from "@/app/types/database";

export const currentTeam: Team = {
  id: "team-1",
  name: "Santos FC",
  captainName: "Luca Bianchi",
  captainEmail: "luca@santos.test",
  captainPhone: "+39 333 1111111",
  packageType: "full",
  paymentStatus: "confirmed",
};

export const currentTeamPlayers: Player[] = [
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
    teamId: "team-1",
    firstName: "Andrea",
    lastName: "Gallo",
    shirtNumber: 4,
    checkedIn: false,
  },
];