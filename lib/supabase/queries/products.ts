import { createClient } from "@/lib/supabase/server";
import type { Database, ProductWithRelations } from "@/types/database";

type HealthTag = Database["public"]["Tables"]["products"]["Row"]["health_tags"][number];
type Species = Database["public"]["Tables"]["products"]["Row"]["species"][number];

export interface ProductFilters {
  species?: Species;
  health_tags?: HealthTag[];
  life_stage?: string[];
  breed_tags?: string[];
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
  if (filters.life_stage && filters.life_stage.length > 0) {
    query = query.overlaps("life_stage", filters.life_stage);
  }
  if (filters.breed_tags && filters.breed_tags.length > 0) {
    // Products matching the breed OR with empty breed_tags (universal — no breed restriction)
    const breedList = filters.breed_tags.map(b => b.replace(/[{}"\\]/g, "")).join(",")
    query = query.or(`breed_tags.ov.{${breedList}},breed_tags.eq.{}`)
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

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("parent_id", null)
    .order("name")
  if (error) throw error
  return data
}

export async function getBreedTags(): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("breed_tags")
    .eq("is_active", true)
  if (error) throw error
  const tags = new Set<string>()
  for (const row of data ?? []) {
    for (const tag of row.breed_tags ?? []) {
      if (tag) tags.add(tag)
    }
  }
  return Array.from(tags).sort()
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
