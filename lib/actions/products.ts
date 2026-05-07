"use server"

import { createAdminClient } from "@/lib/supabase/admin"

type CreateProductInput = {
  name_seo: string
  slug: string
  price_original: number
  price_sell: number
  stock: number
  description_seo?: string
  species?: string[]
  health_tags?: string[]
  is_premium_verified?: boolean
  status?: string
}

// UI → DB: panel uses "Active"/"Draft"/"Out of stock", DB uses 'active'/'draft'/'archived'
function toDbStatus(uiStatus: string): string {
  const map: Record<string, string> = {
    "Active":       "active",
    "Draft":        "draft",
    "Out of stock": "archived",
  }
  return map[uiStatus] ?? uiStatus.toLowerCase()
}

export async function getAdminProducts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name_seo, name_original, slug, price_sell, stock, status, is_premium_verified, health_tags, species, updated_at, categories(name)")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("[admin] getAdminProducts error:", error)
    return []
  }
  return data ?? []
}

export async function updateProduct(
  id: string,
  input: {
    name_seo?: string
    slug?: string
    price_sell?: number
    stock?: number
    status?: string
    is_premium_verified?: boolean
    health_tags?: string[]
    species?: string[]
  }
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const dbStatus = input.status !== undefined ? toDbStatus(input.status) : undefined
  const updates: {
    name_seo?: string
    slug?: string
    price_sell?: number
    stock?: number
    status?: string
    is_premium_verified?: boolean
    health_tags?: string[]
    species?: string[]
    is_active?: boolean
    updated_at: string
  } = {
    ...(input.name_seo !== undefined && { name_seo: input.name_seo }),
    ...(input.slug !== undefined && { slug: input.slug }),
    ...(input.price_sell !== undefined && { price_sell: input.price_sell }),
    ...(input.stock !== undefined && { stock: input.stock }),
    ...(input.is_premium_verified !== undefined && { is_premium_verified: input.is_premium_verified }),
    ...(input.health_tags !== undefined && { health_tags: input.health_tags }),
    ...(input.species !== undefined && { species: input.species }),
    ...(dbStatus !== undefined && { status: dbStatus }),
    updated_at: new Date().toISOString(),
  }
  if ("stock" in input || "status" in input) {
    updates.is_active = (input.stock ?? 0) > 0 && dbStatus === "active"
  }
  const { error } = await supabase.from("products").update(updates).eq("id", id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function createProduct(
  input: CreateProductInput
): Promise<{ id: string } | { error: string }> {
  const supabase = createAdminClient()

  const dbStatus = toDbStatus(input.status ?? "Draft")

  const { data, error } = await supabase
    .from("products")
    .insert({
      name_seo: input.name_seo,
      slug: input.slug,
      price_original: input.price_original,
      price_sell: input.price_sell,
      stock: input.stock ?? 0,
      description_seo: input.description_seo ?? null,
      species: input.species ?? [],
      health_tags: input.health_tags ?? [],
      is_premium_verified: input.is_premium_verified ?? false,
      status: dbStatus,
      is_active: (input.stock ?? 0) > 0 && dbStatus === "active",
    })
    .select("id")
    .single()

  if (error) return { error: error.message }
  return { id: data.id }
}

// ── Ingredients ───────────────────────────────────────────────────────────────

export async function getProductIngredients(productId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("product_ingredients")
    .select("id, ingredient_name, ingredient_description, amount, is_highlighted, order_index")
    .eq("product_id", productId)
    .order("order_index", { ascending: true })
  if (error) return []
  return data ?? []
}

export async function addIngredient(
  productId: string,
  input: { ingredient_name: string; ingredient_description?: string; amount?: string; is_highlighted?: boolean }
): Promise<{ id: string } | { error: string }> {
  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from("product_ingredients")
    .select("order_index")
    .eq("product_id", productId)
    .order("order_index", { ascending: false })
    .limit(1)
  const nextIndex = existing?.[0]?.order_index != null ? existing[0].order_index + 1 : 0
  const { data, error } = await supabase
    .from("product_ingredients")
    .insert({
      product_id: productId,
      ingredient_name: input.ingredient_name,
      ingredient_description: input.ingredient_description ?? null,
      amount: input.amount ?? null,
      is_highlighted: input.is_highlighted ?? false,
      order_index: nextIndex,
    })
    .select("id")
    .single()
  if (error) return { error: error.message }
  return { id: data.id }
}

export async function updateIngredient(
  id: string,
  input: { ingredient_name?: string; ingredient_description?: string | null; amount?: string | null; is_highlighted?: boolean }
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("product_ingredients")
    .update(input)
    .eq("id", id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function deleteIngredient(id: string): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("product_ingredients").delete().eq("id", id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function reorderIngredients(updates: { id: string; order_index: number }[]): Promise<void> {
  const supabase = createAdminClient()
  await Promise.all(
    updates.map(({ id, order_index }) =>
      supabase.from("product_ingredients").update({ order_index }).eq("id", id)
    )
  )
}
