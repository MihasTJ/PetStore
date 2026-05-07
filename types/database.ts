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
  public: {
    Tables: {
      ai_alerts: {
        Row: {
          alert_type: string
          created_at: string
          customer_id: string
          id: string
          is_sent: boolean
          message: string
          pet_profile_id: string
          product_id: string | null
          scheduled_at: string
          sent_at: string | null
          urgency: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          customer_id: string
          id?: string
          is_sent?: boolean
          message: string
          pet_profile_id: string
          product_id?: string | null
          scheduled_at?: string
          sent_at?: string | null
          urgency?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_sent?: boolean
          message?: string
          pet_profile_id?: string
          product_id?: string | null
          scheduled_at?: string
          sent_at?: string | null
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_alerts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_alerts_pet_profile_id_fkey"
            columns: ["pet_profile_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      health_reports: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          pet_profile_id: string
          quiz_data: Json
          recommendations: Json
          report_pdf_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          pet_profile_id: string
          quiz_data?: Json
          recommendations?: Json
          report_pdf_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          pet_profile_id?: string
          quiz_data?: Json
          recommendations?: Json
          report_pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_reports_pet_profile_id_fkey"
            columns: ["pet_profile_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      import_logs: {
        Row: {
          created_at: string
          errors_count: number
          id: string
          message: string | null
          products_updated: number
          status: string
          supplier_id: string
        }
        Insert: {
          created_at?: string
          errors_count?: number
          id?: string
          message?: string | null
          products_updated?: number
          status: string
          supplier_id: string
        }
        Update: {
          created_at?: string
          errors_count?: number
          id?: string
          message?: string | null
          products_updated?: number
          status?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_logs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          product_snapshot: Json
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          product_snapshot: Json
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          product_snapshot?: Json
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          confirmation_email_sent: boolean
          created_at: string
          customer_id: string | null
          id: string
          nip: string | null
          packaging_note: string | null
          payment_id: string | null
          payment_status: string
          pet_name: string | null
          premium_packaging: boolean
          shipping_address: Json
          shipping_cost: number
          shipping_method: string
          status: string
          total_amount: number
        }
        Insert: {
          confirmation_email_sent?: boolean
          created_at?: string
          customer_id?: string | null
          id?: string
          nip?: string | null
          packaging_note?: string | null
          payment_id?: string | null
          payment_status?: string
          pet_name?: string | null
          premium_packaging?: boolean
          shipping_address: Json
          shipping_cost: number
          shipping_method: string
          status?: string
          total_amount: number
        }
        Update: {
          confirmation_email_sent?: boolean
          created_at?: string
          customer_id?: string | null
          id?: string
          nip?: string | null
          packaging_note?: string | null
          payment_id?: string | null
          payment_status?: string
          pet_name?: string | null
          premium_packaging?: boolean
          shipping_address?: Json
          shipping_cost?: number
          shipping_method?: string
          status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_profiles: {
        Row: {
          birth_date: string | null
          breed: string | null
          created_at: string
          customer_id: string
          health_notes: string | null
          id: string
          pet_name: string
          species: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          customer_id: string
          health_notes?: string | null
          id?: string
          pet_name: string
          species: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          customer_id?: string
          health_notes?: string | null
          id?: string
          pet_name?: string
          species?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_certificates: {
        Row: {
          certificate_name: string
          created_at: string
          file_url: string | null
          id: string
          issuing_body: string | null
          product_id: string
          valid_until: string | null
        }
        Insert: {
          certificate_name: string
          created_at?: string
          file_url?: string | null
          id?: string
          issuing_body?: string | null
          product_id: string
          valid_until?: string | null
        }
        Update: {
          certificate_name?: string
          created_at?: string
          file_url?: string | null
          id?: string
          issuing_body?: string | null
          product_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_certificates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_endorsements: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quote: string
          vet_name: string
          vet_photo_url: string | null
          vet_title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quote: string
          vet_name: string
          vet_photo_url?: string | null
          vet_title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quote?: string
          vet_name?: string
          vet_photo_url?: string | null
          vet_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_endorsements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ingredients: {
        Row: {
          amount: string | null
          created_at: string
          id: string
          ingredient_description: string | null
          ingredient_name: string
          is_highlighted: boolean
          order_index: number
          product_id: string
        }
        Insert: {
          amount?: string | null
          created_at?: string
          id?: string
          ingredient_description?: string | null
          ingredient_name: string
          is_highlighted?: boolean
          order_index?: number
          product_id: string
        }
        Update: {
          amount?: string | null
          created_at?: string
          id?: string
          ingredient_description?: string | null
          ingredient_name?: string
          is_highlighted?: boolean
          order_index?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          breed_tags: string[]
          category_id: string | null
          created_at: string
          daily_price_pln: number | null
          description_original: string | null
          description_seo: string | null
          expert_tags: string[]
          external_id: string | null
          health_tags: string[]
          id: string
          images: string[]
          is_active: boolean
          is_premium_verified: boolean
          is_seo_locked: boolean
          life_stage: string[]
          name_original: string | null
          name_seo: string
          price_original: number
          price_sell: number
          quality_badge_ids: string[]
          review_count: number
          slug: string
          species: string[]
          status: string
          stock: number
          supplier_id: string | null
          updated_at: string
          usage_days: number | null
        }
        Insert: {
          breed_tags?: string[]
          category_id?: string | null
          created_at?: string
          daily_price_pln?: number | null
          description_original?: string | null
          description_seo?: string | null
          expert_tags?: string[]
          external_id?: string | null
          health_tags?: string[]
          id?: string
          images?: string[]
          is_active?: boolean
          is_premium_verified?: boolean
          is_seo_locked?: boolean
          life_stage?: string[]
          name_original?: string | null
          name_seo: string
          price_original: number
          price_sell: number
          quality_badge_ids?: string[]
          review_count?: number
          slug: string
          species?: string[]
          status?: string
          stock?: number
          supplier_id?: string | null
          updated_at?: string
          usage_days?: number | null
        }
        Update: {
          breed_tags?: string[]
          category_id?: string | null
          created_at?: string
          daily_price_pln?: number | null
          description_original?: string | null
          description_seo?: string | null
          expert_tags?: string[]
          external_id?: string | null
          health_tags?: string[]
          id?: string
          images?: string[]
          is_active?: boolean
          is_premium_verified?: boolean
          is_seo_locked?: boolean
          life_stage?: string[]
          name_original?: string | null
          name_seo?: string
          price_original?: number
          price_sell?: number
          quality_badge_ids?: string[]
          review_count?: number
          slug?: string
          species?: string[]
          status?: string
          stock?: number
          supplier_id?: string | null
          updated_at?: string
          usage_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          customer_id: string
          id: string
          is_verified_purchase: boolean
          pet_photo_url: string | null
          pet_profile_id: string | null
          product_id: string
          rating: number
        }
        Insert: {
          body: string
          created_at?: string
          customer_id: string
          id?: string
          is_verified_purchase?: boolean
          pet_photo_url?: string | null
          pet_profile_id?: string | null
          product_id: string
          rating: number
        }
        Update: {
          body?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_verified_purchase?: boolean
          pet_photo_url?: string | null
          pet_profile_id?: string | null
          product_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_pet_profile_id_fkey"
            columns: ["pet_profile_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          id: string
          is_active: boolean
          name: string
          price: number
          provider: string
          weight_limit: number | null
        }
        Insert: {
          id?: string
          is_active?: boolean
          name: string
          price: number
          provider: string
          weight_limit?: number | null
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          provider?: string
          weight_limit?: number | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          api_key: string | null
          api_type: string
          currency: string
          currency_buffer_pct: number
          id: string
          is_active: boolean
          last_sync_at: string | null
          name: string
        }
        Insert: {
          api_key?: string | null
          api_type: string
          currency?: string
          currency_buffer_pct?: number
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          name: string
        }
        Update: {
          api_key?: string | null
          api_type?: string
          currency?: string
          currency_buffer_pct?: number
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          name?: string
        }
        Relationships: []
      }
      brand_experts: {
        Row: {
          id: string
          name: string
          role: string
          description: string | null
          specialization_tags: string[]
          ai_generated_avatar_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          role: string
          description?: string | null
          specialization_tags?: string[]
          ai_generated_avatar_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          role?: string
          description?: string | null
          specialization_tags?: string[]
          ai_generated_avatar_url?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      expert_endorsements: {
        Row: {
          id: string
          product_id: string
          expert_id: string
          quote: string
          validation_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          expert_id: string
          quote: string
          validation_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          expert_id?: string
          quote?: string
          validation_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_endorsements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_endorsements_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "brand_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_badges: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          icon_url: string | null
          criteria_md: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          icon_url?: string | null
          criteria_md?: string | null
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          icon_url?: string | null
          criteria_md?: string | null
        }
        Relationships: []
      }
      product_quality_badges: {
        Row: {
          id: string
          product_id: string
          badge_id: string
          validated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          badge_id: string
          validated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          badge_id?: string
          validated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_quality_badges_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_quality_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "quality_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          id: string
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_order_details_for_email: {
        Args: { p_order_id: string }
        Returns: Json
      }
      get_order_for_confirmation: {
        Args: { p_order_id: string }
        Returns: {
          id: string
          payment_status: string
          pet_name: string
          shipping_address: Json
          total_amount: number
        }[]
      }
      mark_confirmation_email_sent: {
        Args: { p_order_id: string }
        Returns: {
          sent: boolean
        }[]
      }
      update_order_payment: {
        Args: {
          p_order_id: string
          p_order_status: string
          p_payment_status: string
          p_payu_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

// Convenience row type aliases
export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type PetProfile = Database["public"]["Tables"]["pet_profiles"]["Row"]
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductCertificate = Database["public"]["Tables"]["product_certificates"]["Row"]
export type ProductEndorsement = Database["public"]["Tables"]["product_endorsements"]["Row"]
export type ProductIngredient = Database["public"]["Tables"]["product_ingredients"]["Row"]
export type HealthReport = Database["public"]["Tables"]["health_reports"]["Row"]
export type AiAlert = Database["public"]["Tables"]["ai_alerts"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"]
export type BrandExpert = Database["public"]["Tables"]["brand_experts"]["Row"]
export type ExpertEndorsement = Database["public"]["Tables"]["expert_endorsements"]["Row"]
export type QualityBadge = Database["public"]["Tables"]["quality_badges"]["Row"]
export type SiteContent = Database["public"]["Tables"]["site_content"]["Row"]

export type OrderWithItems = Order & {
  order_items: (OrderItem & { product_snapshot: { name: string; weight?: string } })[]
}

export type ProductWithRelations = Product & {
  product_ingredients: ProductIngredient[]
}

export type AlertWithProduct = AiAlert & {
  products: Pick<Product, "id" | "slug" | "name_seo"> | null
}
