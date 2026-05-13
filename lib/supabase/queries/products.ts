import { createClient } from "@/lib/supabase/server";
import type { Database, ProductWithRelations } from "@/types/database";

type HealthTag = Database["public"]["Tables"]["products"]["Row"]["health_tags"][number];
type LifeStage = Database["public"]["Tables"]["products"]["Row"]["life_stage"][number];
type Species = Database["public"]["Tables"]["products"]["Row"]["species"][number];

export interface ProductFilters {
  species?: Species;
  health_tags?: HealthTag[];
  life_stage?: LifeStage;
  is_premium_verified?: boolean;
  category_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `*, categories(name, slug)`
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters.is_premium_verified) {
    query = query.eq("is_premium_verified", true);
  }
  if (filters.category_id) {
    query = query.eq("category_id", filters.category_id);
  }
  if (filters.species) {
    query = query.contains("species", [filters.species]);
  }
  if (filters.life_stage) {
    query = query.contains("life_stage", [filters.life_stage]);
  }
  if (filters.health_tags && filters.health_tags.length > 0) {
    query = query.overlaps("health_tags", filters.health_tags);
  }
  if (filters.search) {
    query = query.ilike("name_seo", `%${filters.search}%`);
  }
  if (typeof filters.offset === "number" && typeof filters.limit === "number") {
    query = query.range(filters.offset, filters.offset + filters.limit - 1);
  } else if (typeof filters.limit === "number") {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductBySlug(
  slug: string,
  options: { preview?: boolean } = {}
): Promise<ProductWithRelations | null> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`*, product_ingredients(*), categories(name, slug)`)
    .eq("slug", slug);

  if (!options.preview) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  if (data?.product_ingredients) {
    data.product_ingredients.sort((a, b) => a.order_index - b.order_index);
  }

  return data as ProductWithRelations;
}

export async function getFeaturedProducts(limit = 6) {
  return getProducts({ is_premium_verified: true, limit });
}

export async function getProductsForQuizRecommendations(
  healthTags: HealthTag[],
  species: Species,
  limit = 3
) {
  return getProducts({ health_tags: healthTags, species, is_premium_verified: true, limit });
}
