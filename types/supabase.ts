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
      club_enrolments: {
        Row: {
          club_id: number;
          created_at: string;
          id: number;
          role: string | null;
          status: string | null;
          user_id: string;
        };
        Insert: {
          club_id: number;
          created_at?: string;
          id?: number;
          role?: string | null;
          status?: string | null;
          user_id: string;
        };
        Update: {
          club_id?: number;
          created_at?: string;
          id?: number;
          role?: string | null;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_enrollments_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_enrolments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      clubs: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          creator_id: string;
          deleted_at: string | null;
          description: string | null;
          edited_at: string | null;
          id: number;
          logo_url: string | null;
          name: string | null;
          postcode: string | null;
          status: string;
          url: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          creator_id: string;
          deleted_at?: string | null;
          description?: string | null;
          edited_at?: string | null;
          id?: number;
          logo_url?: string | null;
          name?: string | null;
          postcode?: string | null;
          status?: string;
          url?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          creator_id?: string;
          deleted_at?: string | null;
          description?: string | null;
          edited_at?: string | null;
          id?: number;
          logo_url?: string | null;
          name?: string | null;
          postcode?: string | null;
          status?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "clubs_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          created_at: string;
          followed_user_id: string | null;
          id: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          followed_user_id?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          followed_user_id?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "follows_followed_user_id_fkey";
            columns: ["followed_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      game_event: {
        Row: {
          created_at: string;
          game_id: number | null;
          id: string;
          type: string | null;
          user_id: string | null;
          value: number | null;
        };
        Insert: {
          created_at?: string;
          game_id?: number | null;
          id?: string;
          type?: string | null;
          user_id?: string | null;
          value?: number | null;
        };
        Update: {
          created_at?: string;
          game_id?: number | null;
          id?: string;
          type?: string | null;
          user_id?: string | null;
          value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "game_event_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_event_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      game_registrations: {
        Row: {
          created_at: string;
          game_id: number | null;
          id: string;
          status: string | null;
          team: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          game_id?: number | null;
          id?: string;
          status?: string | null;
          team?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          game_id?: number | null;
          id?: string;
          status?: string | null;
          team?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "game_registrations_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_registrations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          category: string | null;
          club_id: number;
          created_at: string;
          creator_id: string;
          date: string;
          duration: unknown | null;
          id: number;
          location: string | null;
          name: string | null;
          opponent_id: number | null;
          score: number[] | null;
          status: string;
          total_players: number | null;
        };
        Insert: {
          category?: string | null;
          club_id: number;
          created_at?: string;
          creator_id: string;
          date: string;
          duration?: unknown | null;
          id?: number;
          location?: string | null;
          name?: string | null;
          opponent_id?: number | null;
          score?: number[] | null;
          status?: string;
          total_players?: number | null;
        };
        Update: {
          category?: string | null;
          club_id?: number;
          created_at?: string;
          creator_id?: string;
          date?: string;
          duration?: unknown | null;
          id?: number;
          location?: string | null;
          name?: string | null;
          opponent_id?: number | null;
          score?: number[] | null;
          status?: string;
          total_players?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "games_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "games_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "games_opponent_id_fkey";
            columns: ["opponent_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          edited_at: string | null;
          email_notifications: boolean | null;
          firstname: string | null;
          id: string;
          lastname: string | null;
          status: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          edited_at?: string | null;
          email_notifications?: boolean | null;
          firstname?: string | null;
          id: string;
          lastname?: string | null;
          status?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          edited_at?: string | null;
          email_notifications?: boolean | null;
          firstname?: string | null;
          id?: string;
          lastname?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
