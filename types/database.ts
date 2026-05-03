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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          parent_id?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      pet_profiles: {
        Row: {
          id: string
          customer_id: string
          pet_name: string
          species: "pies" | "kot" | "inny"
          breed: string | null
          birth_date: string | null
          weight_kg: number | null
          health_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          pet_name: string
          species: "pies" | "kot" | "inny"
          breed?: string | null
          birth_date?: string | null
          weight_kg?: number | null
          health_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          pet_name?: string
          species?: "pies" | "kot" | "inny"
          breed?: string | null
          birth_date?: string | null
          weight_kg?: number | null
          health_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          supplier_id: string | null
          external_id: string | null
          slug: string
          name_seo: string
          description_seo: string | null
          is_seo_locked: boolean
          name_original: string | null
          description_original: string | null
          price_original: number
          price_sell: number
          stock: number
          status: "active" | "archived" | "draft"
          is_active: boolean
          is_premium_verified: boolean
          images: string[]
          category_id: string | null
          species: ("pies" | "kot" | "inny")[]
          breed_tags: string[]
          life_stage: ("szczenie" | "dorosly" | "senior")[]
          health_tags: ("stawy" | "siersc" | "trawienie" | "zeby" | "serce" | "waga")[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id?: string | null
          external_id?: string | null
          slug: string
          name_seo: string
          description_seo?: string | null
          is_seo_locked?: boolean
          name_original?: string | null
          description_original?: string | null
          price_original: number
          price_sell: number
          stock?: number
          status?: "active" | "archived" | "draft"
          is_active?: boolean
          is_premium_verified?: boolean
          images?: string[]
          category_id?: string | null
          species?: ("pies" | "kot" | "inny")[]
          breed_tags?: string[]
          life_stage?: ("szczenie" | "dorosly" | "senior")[]
          health_tags?: ("stawy" | "siersc" | "trawienie" | "zeby" | "serce" | "waga")[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string | null
          external_id?: string | null
          slug?: string
          name_seo?: string
          description_seo?: string | null
          is_seo_locked?: boolean
          name_original?: string | null
          description_original?: string | null
          price_original?: number
          price_sell?: number
          stock?: number
          status?: "active" | "archived" | "draft"
          is_active?: boolean
          is_premium_verified?: boolean
          images?: string[]
          category_id?: string | null
          species?: ("pies" | "kot" | "inny")[]
          breed_tags?: string[]
          life_stage?: ("szczenie" | "dorosly" | "senior")[]
          health_tags?: ("stawy" | "siersc" | "trawienie" | "zeby" | "serce" | "waga")[]
          created_at?: string
          updated_at?: string
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
          }
        ]
      }
      product_certificates: {
        Row: {
          id: string
          product_id: string
          certificate_name: string
          issuing_body: string | null
          valid_until: string | null
          file_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          certificate_name: string
          issuing_body?: string | null
          valid_until?: string | null
          file_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          certificate_name?: string
          issuing_body?: string | null
          valid_until?: string | null
          file_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_certificates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_endorsements: {
        Row: {
          id: string
          product_id: string
          vet_name: string
          vet_title: string | null
          vet_photo_url: string | null
          quote: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          vet_name: string
          vet_title?: string | null
          vet_photo_url?: string | null
          quote: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          vet_name?: string
          vet_title?: string | null
          vet_photo_url?: string | null
          quote?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_endorsements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_ingredients: {
        Row: {
          id: string
          product_id: string
          ingredient_name: string
          ingredient_description: string | null
          is_highlighted: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          ingredient_name: string
          ingredient_description?: string | null
          is_highlighted?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          ingredient_name?: string
          ingredient_description?: string | null
          is_highlighted?: boolean
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      health_reports: {
        Row: {
          id: string
          pet_profile_id: string
          order_id: string | null
          report_pdf_url: string | null
          quiz_data: Json
          recommendations: Json
          created_at: string
        }
        Insert: {
          id?: string
          pet_profile_id: string
          order_id?: string | null
          report_pdf_url?: string | null
          quiz_data: Json
          recommendations: Json
          created_at?: string
        }
        Update: {
          id?: string
          pet_profile_id?: string
          order_id?: string | null
          report_pdf_url?: string | null
          quiz_data?: Json
          recommendations?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_reports_pet_profile_id_fkey"
            columns: ["pet_profile_id"]
            isOneToOne: false
            referencedRelation: "pet_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_alerts: {
        Row: {
          id: string
          customer_id: string
          pet_profile_id: string
          alert_type: "supplement_ending" | "life_stage" | "breed_risk" | "better_product"
          urgency: "high" | "info"
          message: string
          product_id: string | null
          is_sent: boolean
          scheduled_at: string
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          pet_profile_id: string
          alert_type: "supplement_ending" | "life_stage" | "breed_risk" | "better_product"
          urgency?: "high" | "info"
          message: string
          product_id?: string | null
          is_sent?: boolean
          scheduled_at?: string
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          pet_profile_id?: string
          alert_type?: "supplement_ending" | "life_stage" | "breed_risk" | "better_product"
          urgency?: "high" | "info"
          message?: string
          product_id?: string | null
          is_sent?: boolean
          scheduled_at?: string
          sent_at?: string | null
          created_at?: string
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
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
          total_amount: number
          payment_id: string | null
          payment_status: "pending" | "paid" | "failed" | "refunded"
          shipping_method: string
          shipping_cost: number
          shipping_address: Json
          premium_packaging: boolean
          packaging_note: string | null
          nip: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          status?: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
          total_amount: number
          payment_id?: string | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          shipping_method: string
          shipping_cost: number
          shipping_address: Json
          premium_packaging?: boolean
          packaging_note?: string | null
          nip?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          status?: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
          total_amount?: number
          payment_id?: string | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          shipping_method?: string
          shipping_cost?: number
          shipping_address?: Json
          premium_packaging?: boolean
          packaging_note?: string | null
          nip?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
          product_snapshot: Json
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
          product_snapshot: Json
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_purchase?: number
          product_snapshot?: Json
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
          }
        ]
      }
      suppliers: {
        Row: {
          id: string
          name: string
          api_type: string
          api_key: string | null
          currency: string
          currency_buffer_pct: number
          last_sync_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          api_type: string
          api_key?: string | null
          currency?: string
          currency_buffer_pct?: number
          last_sync_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          api_type?: string
          api_key?: string | null
          currency?: string
          currency_buffer_pct?: number
          last_sync_at?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          id: string
          supplier_id: string
          status: "success" | "partial" | "failed"
          products_updated: number
          errors_count: number
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          status: "success" | "partial" | "failed"
          products_updated?: number
          errors_count?: number
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          status?: "success" | "partial" | "failed"
          products_updated?: number
          errors_count?: number
          message?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_logs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      shipping_methods: {
        Row: {
          id: string
          name: string
          provider: string
          price: number
          weight_limit: number | null
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          provider: string
          price: number
          weight_limit?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          provider?: string
          price?: number
          weight_limit?: number | null
          is_active?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_id: string
          pet_profile_id: string | null
          rating: number
          body: string
          pet_photo_url: string | null
          is_verified_purchase: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          customer_id: string
          pet_profile_id?: string | null
          rating: number
          body: string
          pet_photo_url?: string | null
          is_verified_purchase?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          customer_id?: string
          pet_profile_id?: string | null
          rating?: number
          body?: string
          pet_photo_url?: string | null
          is_verified_purchase?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

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

// Composite types used across the app
export type OrderWithItems = Order & {
  order_items: (OrderItem & { product_snapshot: { name: string; weight?: string } })[]
}

export type ProductWithRelations = Product & {
  product_certificates: ProductCertificate[]
  product_endorsements: ProductEndorsement[]
  product_ingredients: ProductIngredient[]
}

export type AlertWithProduct = AiAlert & {
  products: Pick<Product, "id" | "slug" | "name_seo"> | null
}
