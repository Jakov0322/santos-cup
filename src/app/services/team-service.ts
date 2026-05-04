import { teamRepository } from "../repositories/team-repository";

import { useTournamentStore } from "../lib/store/tournament-store";

export const teamService = {
  async getTeams() {
    return await teamRepository.getTeams();
  },

  getTeamById(teamId: string) {
    return useTournamentStore
      .getState()
      .teams.find(
        (team) => team.id === teamId
      );
  },

  confirmPayment(teamId: string) {
    useTournamentStore
      .getState()
      .confirmTeamPayment(
        teamId
      );
  },

  async registerTeam(data: {
    teamName: string;

    captainName: string;

    captainEmail: string;

    captainPhone: string;

    selectedPackage: string;

    players: {
      name: string;
    }[];
  }) {
    const createdTeam =
      await teamRepository.createTeamWithPlayers(
        {
          team: {
            name: data.teamName,

            captain_name:
              data.captainName,

            captain_email:
              data.captainEmail,

            captain_phone:
              data.captainPhone,

            payment_status:
              "pending",
          },

          players: data.players.map(
            (player) => {
              const split =
                player.name.split(
                  " "
                );

              return {
                first_name:
                  split[0] ??
                  "Player",

                last_name:
                  split
                    .slice(1)
                    .join(" ") ??
                  "",
              };
            }
          ),
        }
      );

    return createdTeam;
  },
};