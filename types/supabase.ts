export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      club_member: {
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
      game_player: {
        Row: {
          assists: number | null;
          created_at: string;
          game_id: number;
          goals: number | null;
          id: string;
          name: string | null;
          saves: number | null;
          status: string | null;
          team: number | null;
          user_id: string | null;
        };
        Insert: {
          assists?: number | null;
          created_at?: string;
          game_id: number;
          goals?: number | null;
          id?: string;
          name?: string | null;
          saves?: number | null;
          status?: string | null;
          team?: number | null;
          user_id?: string | null;
        };
        Update: {
          assists?: number | null;
          created_at?: string;
          game_id?: number;
          goals?: number | null;
          id?: string;
          name?: string | null;
          saves?: number | null;
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
          season_id: string | null;
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
          season_id?: string | null;
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
          season_id?: string | null;
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
          {
            foreignKeyName: "games_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "season";
            referencedColumns: ["id"];
          },
        ];
      };
      season: {
        Row: {
          club_id: number | null;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          club_id?: number | null;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          club_id?: number | null;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "season_club_id_fkey";
            columns: ["club_id"];
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
        Relationships: [];
      };
    };
    Views: {
      game_report: {
        Row: {
          assists: number | null;
          away_score: number | null;
          club_id: number | null;
          club_name: string | null;
          firstname: string | null;
          game_date: string | null;
          game_id: number | null;
          goals: number | null;
          home_score: number | null;
          lastname: string | null;
          result: string | null;
          saves: number | null;
          season_id: string | null;
          season_name: string | null;
          user_id: string | null;
          user_team: string | null;
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
          {
            foreignKeyName: "games_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "games_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "season";
            referencedColumns: ["id"];
          },
        ];
      };
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
