export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          group_name: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          group_name: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          group_name?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      players: {
        Row: {
          id: string;
          team_id: string;
          first_name: string;
          last_name: string;
          shirt_number: number;
          position: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          team_id: string;
          first_name: string;
          last_name: string;
          shirt_number: number;
          position: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          team_id?: string;
          first_name?: string;
          last_name?: string;
          shirt_number?: number;
          position?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      matches: {
        Row: {
          id: string;
          home_team_id: string;
          away_team_id: string;
          home_score: number;
          away_score: number;
          status: string;
          phase: string;
          group_name: string | null;
          field_number: number;
          starts_at: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          home_team_id: string;
          away_team_id: string;
          home_score?: number;
          away_score?: number;
          status?: string;
          phase: string;
          group_name?: string | null;
          field_number: number;
          starts_at: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          home_team_id?: string;
          away_team_id?: string;
          home_score?: number;
          away_score?: number;
          status?: string;
          phase?: string;
          group_name?: string | null;
          field_number?: number;
          starts_at?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      match_events: {
        Row: {
          id: string;
          match_id: string;
          player_id: string;
          team_id: string;
          event_type: string;
          minute: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          player_id: string;
          team_id: string;
          event_type: string;
          minute?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          match_id?: string;
          player_id?: string;
          team_id?: string;
          event_type?: string;
          minute?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};