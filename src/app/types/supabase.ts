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
          captain_name: string;
          captain_email: string;
          captain_phone: string;
          package_id: string | null;
          payment_status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          captain_name: string;
          captain_email: string;
          captain_phone: string;
          package_id?: string | null;
          payment_status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          captain_name?: string;
          captain_email?: string;
          captain_phone?: string;
          package_id?: string | null;
          payment_status?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      players: {
        Row: {
          id: string;
          team_id: string | null;
          first_name: string;
          last_name: string;
          shirt_number: number | null;
          role: string | null;
          qr_token: string | null;
          checked_in: boolean | null;
        };
        Insert: {
          id?: string;
          team_id?: string | null;
          first_name: string;
          last_name: string;
          shirt_number?: number | null;
          role?: string | null;
          qr_token?: string | null;
          checked_in?: boolean | null;
        };
        Update: {
          id?: string;
          team_id?: string | null;
          first_name?: string;
          last_name?: string;
          shirt_number?: number | null;
          role?: string | null;
          qr_token?: string | null;
          checked_in?: boolean | null;
        };
        Relationships: [];
      };

      packages: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          includes_lunch: boolean | null;
          includes_drinks: boolean | null;
          includes_beer: boolean | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          includes_lunch?: boolean | null;
          includes_drinks?: boolean | null;
          includes_beer?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          includes_lunch?: boolean | null;
          includes_drinks?: boolean | null;
          includes_beer?: boolean | null;
        };
        Relationships: [];
      };

      matches: {
        Row: {
          id: string;
          home_team_id: string | null;
          away_team_id: string | null;
          field_number: number;
          starts_at: string;
          phase: string;
          group_name: string | null;
          home_score: number | null;
          away_score: number | null;
          status: string | null;
        };
        Insert: {
          id?: string;
          home_team_id?: string | null;
          away_team_id?: string | null;
          field_number: number;
          starts_at: string;
          phase: string;
          group_name?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          home_team_id?: string | null;
          away_team_id?: string | null;
          field_number?: number;
          starts_at?: string;
          phase?: string;
          group_name?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          status?: string | null;
        };
        Relationships: [];
      };

      goals: {
        Row: {
          id: string;
          match_id: string | null;
          player_id: string | null;
          team_id: string | null;
          minute: number | null;
        };
        Insert: {
          id?: string;
          match_id?: string | null;
          player_id?: string | null;
          team_id?: string | null;
          minute?: number | null;
        };
        Update: {
          id?: string;
          match_id?: string | null;
          player_id?: string | null;
          team_id?: string | null;
          minute?: number | null;
        };
        Relationships: [];
      };

      cards: {
        Row: {
          id: string;
          match_id: string | null;
          player_id: string | null;
          card_type: string;
          minute: number | null;
        };
        Insert: {
          id?: string;
          match_id?: string | null;
          player_id?: string | null;
          card_type: string;
          minute?: number | null;
        };
        Update: {
          id?: string;
          match_id?: string | null;
          player_id?: string | null;
          card_type?: string;
          minute?: number | null;
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