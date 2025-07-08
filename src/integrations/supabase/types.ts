export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      etapas: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          nome: string
          obra_id: string | null
          progresso: number | null
          responsavel: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          nome: string
          obra_id?: string | null
          progresso?: number | null
          responsavel: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          nome?: string
          obra_id?: string | null
          progresso?: number | null
          responsavel?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etapas_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          created_at: string
          email: string | null
          funcao: string
          id: string
          nome: string
          status: string
          telefone: string
          tipo_remuneracao: string
          updated_at: string
          user_id: string
          valor_remuneracao: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          funcao: string
          id?: string
          nome: string
          status?: string
          telefone: string
          tipo_remuneracao?: string
          updated_at?: string
          user_id: string
          valor_remuneracao: number
        }
        Update: {
          created_at?: string
          email?: string | null
          funcao?: string
          id?: string
          nome?: string
          status?: string
          telefone?: string
          tipo_remuneracao?: string
          updated_at?: string
          user_id?: string
          valor_remuneracao?: number
        }
        Relationships: []
      }
      materiais: {
        Row: {
          created_at: string
          fornecedor: string
          id: string
          nome: string
          obra_id: string | null
          quantidade: number
          status: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          fornecedor: string
          id?: string
          nome: string
          obra_id?: string | null
          quantidade: number
          status?: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string
          fornecedor?: string
          id?: string
          nome?: string
          obra_id?: string | null
          quantidade?: number
          status?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "materiais_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          cliente: string
          created_at: string
          data_inicio: string
          endereco: string
          id: string
          nome: string
          orcamento: number
          previsao_fim: string
          progresso: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente: string
          created_at?: string
          data_inicio: string
          endereco: string
          id?: string
          nome: string
          orcamento: number
          previsao_fim: string
          progresso?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente?: string
          created_at?: string
          data_inicio?: string
          endereco?: string
          id?: string
          nome?: string
          orcamento?: number
          previsao_fim?: string
          progresso?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orcamentos: {
        Row: {
          cliente: string
          created_at: string
          data_criacao: string
          id: string
          numero: string
          obra: string
          status: string
          updated_at: string
          user_id: string
          validade: string
          valor: number
        }
        Insert: {
          cliente: string
          created_at?: string
          data_criacao?: string
          id?: string
          numero: string
          obra: string
          status?: string
          updated_at?: string
          user_id: string
          validade: string
          valor: number
        }
        Update: {
          cliente?: string
          created_at?: string
          data_criacao?: string
          id?: string
          numero?: string
          obra?: string
          status?: string
          updated_at?: string
          user_id?: string
          validade?: string
          valor?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_expires_at: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_expires_at?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_expires_at?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          categoria: string
          created_at: string
          data: string
          descricao: string
          id: string
          obra_id: string | null
          tipo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data?: string
          descricao: string
          id?: string
          obra_id?: string | null
          tipo: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          obra_id?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user" | "pending" | "blocked"
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
      user_role: ["admin", "user", "pending", "blocked"],
    },
  },
} as const
