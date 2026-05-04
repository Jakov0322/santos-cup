import { supabase } from "@/app/lib/supabase/client";

import { Database } from "@/app/types/supabase";

type TeamInsert =
  Database["public"]["Tables"]["teams"]["Insert"];

type PlayerInsert =
  Database["public"]["Tables"]["players"]["Insert"];

export const teamRepository = {
  async getTeams() {
    const { data, error } =
      await supabase
        .from("teams")
        .select("*");

    if (error) {
      throw error;
    }

    return data;
  },

  async createTeam(
    team: TeamInsert
  ) {
    const { data, error } =
      await supabase
        .from("teams")
        .insert(team)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async createPlayers(
    players: PlayerInsert[]
  ) {
    const { data, error } =
      await supabase
        .from("players")
        .insert(players)
        .select();

    if (error) {
      throw error;
    }

    return data;
  },

  async createTeamWithPlayers(params: {
    team: TeamInsert;

    players: {
      first_name: string;
      last_name: string;
      shirt_number?: number;
    }[];
  }) {
    const createdTeam =
      await this.createTeam(
        params.team
      );

    const playersPayload =
      params.players.map(
        (player, index) => ({
          team_id: createdTeam.id,

          first_name:
            player.first_name,

          last_name:
            player.last_name,

          shirt_number:
            player.shirt_number ??
            index + 1,

          qr_token:
            crypto.randomUUID(),
        })
      );

    await this.createPlayers(
      playersPayload
    );

    return createdTeam;
  },
};