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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      caninos: {
        Row: {
          created_at: string
          fecha_nacimiento: string | null
          id: string
          nombre: string
          peso_kg: number | null
          propietario_id: string
          raza: string | null
          sexo: string
        }
        Insert: {
          created_at?: string
          fecha_nacimiento?: string | null
          id?: string
          nombre: string
          peso_kg?: number | null
          propietario_id: string
          raza?: string | null
          sexo: string
        }
        Update: {
          created_at?: string
          fecha_nacimiento?: string | null
          id?: string
          nombre?: string
          peso_kg?: number | null
          propietario_id?: string
          raza?: string | null
          sexo?: string
        }
        Relationships: [
          {
            foreignKeyName: "caninos_propietario_id_fkey"
            columns: ["propietario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      citas: {
        Row: {
          canino_id: string
          created_at: string
          estado: string
          fecha_hora: string
          id: string
          observaciones: string | null
          servicio_id: string
          usuario_id: string
        }
        Insert: {
          canino_id: string
          created_at?: string
          estado?: string
          fecha_hora: string
          id?: string
          observaciones?: string | null
          servicio_id: string
          usuario_id: string
        }
        Update: {
          canino_id?: string
          created_at?: string
          estado?: string
          fecha_hora?: string
          id?: string
          observaciones?: string | null
          servicio_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "citas_canino_id_fkey"
            columns: ["canino_id"]
            isOneToOne: false
            referencedRelation: "caninos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      historiales_clinicos: {
        Row: {
          canino_id: string
          cita_id: string
          created_at: string
          diagnostico: string | null
          id: string
          medicamentos: string | null
          motivo_consulta: string
          tratamiento: string | null
          veterinario_id: string
        }
        Insert: {
          canino_id: string
          cita_id: string
          created_at?: string
          diagnostico?: string | null
          id?: string
          medicamentos?: string | null
          motivo_consulta: string
          tratamiento?: string | null
          veterinario_id: string
        }
        Update: {
          canino_id?: string
          cita_id?: string
          created_at?: string
          diagnostico?: string | null
          id?: string
          medicamentos?: string | null
          motivo_consulta?: string
          tratamiento?: string | null
          veterinario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historiales_clinicos_canino_id_fkey"
            columns: ["canino_id"]
            isOneToOne: false
            referencedRelation: "caninos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historiales_clinicos_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: true
            referencedRelation: "citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historiales_clinicos_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          cita_id: string
          estado: string
          fecha_pago: string | null
          id: string
          metodo_pago: string
          monto: number
          referencia_externa: string | null
        }
        Insert: {
          cita_id: string
          estado?: string
          fecha_pago?: string | null
          id?: string
          metodo_pago: string
          monto: number
          referencia_externa?: string | null
        }
        Update: {
          cita_id?: string
          estado?: string
          fecha_pago?: string | null
          id?: string
          metodo_pago?: string
          monto?: number
          referencia_externa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: true
            referencedRelation: "citas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicios: {
        Row: {
          activo: boolean
          categoria: string
          created_at: string
          descripcion: string | null
          duracion_minutos: number
          id: string
          nombre: string
          precio: number
        }
        Insert: {
          activo?: boolean
          categoria: string
          created_at?: string
          descripcion?: string | null
          duracion_minutos: number
          id?: string
          nombre: string
          precio: number
        }
        Update: {
          activo?: boolean
          categoria?: string
          created_at?: string
          descripcion?: string | null
          duracion_minutos?: number
          id?: string
          nombre?: string
          precio?: number
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          direccion: string | null
          email: string
          id: string
          nombre_completo: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          direccion?: string | null
          email: string
          id: string
          nombre_completo: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          direccion?: string | null
          email?: string
          id?: string
          nombre_completo?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_rol: {
        Args: never
        Returns: Database["public"]["Enums"]["rol_usuario"]
      }
    }
    Enums: {
      rol_usuario: "propietario" | "veterinario" | "administrador"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      rol_usuario: ["propietario", "veterinario", "administrador"],
    },
  },
} as const
