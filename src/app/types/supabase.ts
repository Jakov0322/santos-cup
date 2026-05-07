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

      admin_users: {
        Row: {
          id: string;
          auth_uid: string;
          email: string;
          name: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          auth_uid: string;
          email: string;
          name: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          auth_uid?: string;
          email?: string;
          name?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      mvp_nominations: {
        Row: {
          id: string;
          match_id: string;
          player_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          player_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          match_id?: string;
          player_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };

      mvp_votes: {
        Row: {
          id: string;
          match_id: string;
          player_id: string;
          voter_uid: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          player_id: string;
          voter_uid: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          match_id?: string;
          player_id?: string;
          voter_uid?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Functions: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Enums: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    CompositeTypes: {};
  };
};