export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activation_codes: {
        Row: {
          code: string
          created_at: string
          disabled: boolean
          expires_at: string | null
          max_redemptions: number
          redeemed_count: number
          set_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          disabled?: boolean
          expires_at?: string | null
          max_redemptions?: number
          redeemed_count?: number
          set_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          disabled?: boolean
          expires_at?: string | null
          max_redemptions?: number
          redeemed_count?: number
          set_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      activation_redemptions: {
        Row: {
          code: string
          id: string
          redeemed_at: string
          set_id: string
          user_id: string
        }
        Insert: {
          code: string
          id?: string
          redeemed_at?: string
          set_id: string
          user_id: string
        }
        Update: {
          code?: string
          id?: string
          redeemed_at?: string
          set_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activation_redemptions_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "activation_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          whisky_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          whisky_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          whisky_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_whisky_id_fkey"
            columns: ["whisky_id"]
            isOneToOne: false
            referencedRelation: "whiskies"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_md: string
          created_at: string
          id: string
          set_id: string | null
          slug: string
          sort: number
          title: string
          type: Database["public"]["Enums"]["lesson_type"]
          updated_at: string
          whisky_id: string | null
        }
        Insert: {
          content_md: string
          created_at?: string
          id?: string
          set_id?: string | null
          slug: string
          sort?: number
          title: string
          type: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string
          whisky_id?: string | null
        }
        Update: {
          content_md?: string
          created_at?: string
          id?: string
          set_id?: string | null
          slug?: string
          sort?: number
          title?: string
          type?: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string
          whisky_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          id: string
          score: number
          updated_at: string
          user_id: string
          whisky_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          score: number
          updated_at?: string
          user_id: string
          whisky_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          score?: number
          updated_at?: string
          user_id?: string
          whisky_id?: string
        }
        Relationships: []
      }
      tasting_notes: {
        Row: {
          created_at: string
          descriptors: string[]
          finish: string | null
          id: string
          nose: string | null
          overall_score: number
          palate: string | null
          set_id: string
          updated_at: string
          user_id: string
          whisky_id: string
        }
        Insert: {
          created_at?: string
          descriptors?: string[]
          finish?: string | null
          id?: string
          nose?: string | null
          overall_score: number
          palate?: string | null
          set_id: string
          updated_at?: string
          user_id: string
          whisky_id: string
        }
        Update: {
          created_at?: string
          descriptors?: string[]
          finish?: string | null
          id?: string
          nose?: string | null
          overall_score?: number
          palate?: string | null
          set_id?: string
          updated_at?: string
          user_id?: string
          whisky_id?: string
        }
        Relationships: []
      }
      tasting_progress: {
        Row: {
          completed_lessons: Json
          completed_whiskies: number
          created_at: string
          current_step: number
          id: string
          set_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons?: Json
          completed_whiskies?: number
          created_at?: string
          current_step?: number
          id?: string
          set_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons?: Json
          completed_whiskies?: number
          created_at?: string
          current_step?: number
          id?: string
          set_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasting_set_whiskies: {
        Row: {
          created_at: string
          expert_notes_md: string | null
          id: string
          set_id: string
          sort: number
          updated_at: string
          whisky_id: string
        }
        Insert: {
          created_at?: string
          expert_notes_md?: string | null
          id?: string
          set_id: string
          sort?: number
          updated_at?: string
          whisky_id: string
        }
        Update: {
          created_at?: string
          expert_notes_md?: string | null
          id?: string
          set_id?: string
          sort?: number
          updated_at?: string
          whisky_id?: string
        }
        Relationships: []
      }
      tasting_sets: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          total_steps: number
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          total_steps?: number
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          total_steps?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          value: number
          whisky_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          value: number
          whisky_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          value?: number
          whisky_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_whisky_id_fkey"
            columns: ["whisky_id"]
            isOneToOne: false
            referencedRelation: "whiskies"
            referencedColumns: ["id"]
          },
        ]
      }
      whiskies: {
        Row: {
          abv: number | null
          created_at: string
          description: string | null
          distillery: string | null
          id: string
          image_path: string | null
          image_url: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          abv?: number | null
          created_at?: string
          description?: string | null
          distillery?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          abv?: number | null
          created_at?: string
          description?: string | null
          distillery?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_activation_code: {
        Args: { p_code: string }
        Returns: {
          set_id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      lesson_type: "history" | "technique" | "flavor_language" | "expert_notes"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      lesson_type: ["history", "technique", "flavor_language", "expert_notes"],
    },
  },
} as const
