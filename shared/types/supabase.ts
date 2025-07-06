export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      club_member: {
        Row: {
          club_id: number
          created_at: string
          id: number
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          club_id: number
          created_at?: string
          id?: number
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          club_id?: number
          created_at?: string
          id?: number
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_enrollments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_enrolments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          creator_id: string
          deleted_at: string | null
          description: string | null
          edited_at: string | null
          id: number
          logo_url: string | null
          name: string | null
          postcode: string | null
          status: string
          url: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          creator_id: string
          deleted_at?: string | null
          description?: string | null
          edited_at?: string | null
          id?: number
          logo_url?: string | null
          name?: string | null
          postcode?: string | null
          status?: string
          url?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          creator_id?: string
          deleted_at?: string | null
          description?: string | null
          edited_at?: string | null
          id?: number
          logo_url?: string | null
          name?: string | null
          postcode?: string | null
          status?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_player: {
        Row: {
          assists: number | null
          created_at: string
          game_id: number
          goals: number | null
          id: string
          name: string | null
          saves: number | null
          status: string | null
          team: number | null
          user_id: string | null
        }
        Insert: {
          assists?: number | null
          created_at?: string
          game_id: number
          goals?: number | null
          id?: string
          name?: string | null
          saves?: number | null
          status?: string | null
          team?: number | null
          user_id?: string | null
        }
        Update: {
          assists?: number | null
          created_at?: string
          game_id?: number
          goals?: number | null
          id?: string
          name?: string | null
          saves?: number | null
          status?: string | null
          team?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_registrations_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          category: string | null
          club_id: number
          created_at: string
          creator_id: string
          date: string
          duration: unknown | null
          id: number
          location: string | null
          name: string | null
          opponent_id: number | null
          score: number[] | null
          season_id: string | null
          status: string
          total_players: number | null
        }
        Insert: {
          category?: string | null
          club_id: number
          created_at?: string
          creator_id: string
          date: string
          duration?: unknown | null
          id?: number
          location?: string | null
          name?: string | null
          opponent_id?: number | null
          score?: number[] | null
          season_id?: string | null
          status?: string
          total_players?: number | null
        }
        Update: {
          category?: string | null
          club_id?: number
          created_at?: string
          creator_id?: string
          date?: string
          duration?: unknown | null
          id?: number
          location?: string | null
          name?: string | null
          opponent_id?: number | null
          score?: number[] | null
          season_id?: string | null
          status?: string
          total_players?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "games_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          author_id: string
          created_at: string
          description: string | null
          id: string
          recipient_id: string
          status: string
          title: string
          url: string | null
        }
        Insert: {
          author_id?: string
          created_at?: string
          description?: string | null
          id?: string
          recipient_id: string
          status?: string
          title: string
          url?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string | null
          id?: string
          recipient_id?: string
          status?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      season: {
        Row: {
          club_id: number | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          club_id?: number | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          club_id?: number | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          edited_at: string | null
          email_notifications: boolean | null
          firstname: string | null
          id: string
          lastname: string | null
          status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          edited_at?: string | null
          email_notifications?: boolean | null
          firstname?: string | null
          id: string
          lastname?: string | null
          status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          edited_at?: string | null
          email_notifications?: boolean | null
          firstname?: string | null
          id?: string
          lastname?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      game_report: {
        Row: {
          assists: number | null
          away_score: number | null
          club_id: number | null
          club_name: string | null
          firstname: string | null
          game_date: string | null
          game_id: number | null
          goals: number | null
          home_score: number | null
          lastname: string | null
          result: string | null
          saves: number | null
          season_id: string | null
          season_name: string | null
          user_id: string | null
          user_team: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_registrations_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
