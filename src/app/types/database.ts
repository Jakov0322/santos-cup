export type MatchStatus = "scheduled" | "live" | "finished";
export type MatchPhase = "group" | "quarter" | "semi" | "final";
export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";
export type EventType = "goal" | "assist" | "yellow_card" | "red_card" | "mvp";

export interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  group_name: string;
  created_at: string | null;
}

export interface Player {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  shirt_number: number;
  position: PlayerPosition;
  created_at: string | null;
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  status: MatchStatus;
  phase: MatchPhase;
  group_name: string | null;
  field_number: number;
  starts_at: string;
  created_at: string | null;
  // Joined fields
  home_team?: Team;
  away_team?: Team;
}

export interface MatchEvent {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  event_type: EventType;
  minute: number | null;
  created_at: string | null;
  // Joined fields
  player?: Player;
  team?: Team;
}

export interface StandingRow {
  team: Team;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface PlayerStats {
  player: Player;
  team: Team;
  goals: number;
  assists: number;
  mvp_awards: number;
  yellow_cards: number;
  red_cards: number;
}
