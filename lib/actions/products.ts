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
  life_stage?: string[]
  breed_tags?: string[]
  is_premium_verified?: boolean
  status?: string
  category_id?: string | null
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

function fmtDbStatus(s: string): string {
  const map: Record<string, string> = { active: "Aktywny", draft: "Szkic", archived: "Wyprzedany" }
  return map[s] ?? s
}

export async function getAdminProducts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name_seo, name_original, slug, price_sell, price_promo, stock, status, is_premium_verified, health_tags, species, life_stage, breed_tags, updated_at, category_id, categories(name)")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("[admin] getAdminProducts error:", error)
    return []
  }
  return data ?? []
}

export async function getLowestPrice30d(productId: string): Promise<number | null> {
  const supabase = createAdminClient()
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from("product_price_history")
    .select("price_sell")
    .eq("product_id", productId)
    .gte("recorded_at", cutoff)
    .order("price_sell", { ascending: true })
    .limit(1)
  return data?.[0]?.price_sell ?? null
}

export async function updateProduct(
  id: string,
  input: {
    name_seo?: string
    slug?: string
    price_sell?: number
    price_promo?: number | null
    stock?: number
    status?: string
    is_premium_verified?: boolean
    health_tags?: string[]
    species?: string[]
    life_stage?: string[]
    breed_tags?: string[]
    category_id?: string | null
  }
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const dbStatus = input.status !== undefined ? toDbStatus(input.status) : undefined

  // Fetch current values to build diff
  const { data: current } = await supabase
    .from("products")
    .select("name_seo, slug, price_sell, price_promo, stock, status, is_premium_verified, health_tags, species, life_stage, breed_tags, category_id")
    .eq("id", id)
    .single()

  const updates: {
    name_seo?: string
    slug?: string
    price_sell?: number
    price_promo?: number | null
    stock?: number
    status?: string
    is_premium_verified?: boolean
    health_tags?: string[]
    species?: string[]
    life_stage?: string[]
    breed_tags?: string[]
    category_id?: string | null
    is_active?: boolean
    updated_at: string
  } = {
    ...(input.name_seo !== undefined && { name_seo: input.name_seo }),
    ...(input.slug !== undefined && { slug: input.slug }),
    ...(input.price_sell !== undefined && { price_sell: input.price_sell }),
    ...("price_promo" in input && { price_promo: input.price_promo ?? null }),
    ...(input.stock !== undefined && { stock: input.stock }),
    ...(input.is_premium_verified !== undefined && { is_premium_verified: input.is_premium_verified }),
    ...(input.health_tags !== undefined && { health_tags: input.health_tags }),
    ...(input.species !== undefined && { species: input.species }),
    ...(input.life_stage !== undefined && { life_stage: input.life_stage }),
    ...(input.breed_tags !== undefined && { breed_tags: input.breed_tags }),
    ...("category_id" in input && { category_id: input.category_id ?? null }),
    ...(dbStatus !== undefined && { status: dbStatus }),
    updated_at: new Date().toISOString(),
  }
  if ("stock" in input || "status" in input) {
    updates.is_active = (input.stock ?? 0) > 0 && dbStatus === "active"
  }

  const { error } = await supabase.from("products").update(updates).eq("id", id)
  if (error) return { error: error.message }

  // Build and insert changelog entry
  if (current) {
    const lines: string[] = []
    if (input.name_seo !== undefined && input.name_seo !== current.name_seo)
      lines.push("Zmieniono nazwę editorial")
    if (input.slug !== undefined && input.slug !== current.slug)
      lines.push("Zmieniono slug URL")
    if (input.price_sell !== undefined && input.price_sell !== current.price_sell)
      lines.push(`Cena: ${current.price_sell} → ${input.price_sell} PLN`)
    if ("price_promo" in input) {
      const prev = (current as { price_promo?: number | null }).price_promo ?? null
      const next = input.price_promo ?? null
      if (prev !== next) {
        if (next !== null) lines.push(`Promocja: ${next} PLN (regularna ${input.price_sell ?? current.price_sell} PLN)`)
        else lines.push("Usunięto cenę promocyjną")
      }
    }
    if (input.stock !== undefined && input.stock !== current.stock)
      lines.push(`Stan magazynowy: ${current.stock} → ${input.stock} szt.`)
    if (dbStatus !== undefined && dbStatus !== current.status)
      lines.push(`Status: ${fmtDbStatus(current.status)} → ${fmtDbStatus(dbStatus)}`)
    if (input.is_premium_verified !== undefined && input.is_premium_verified !== current.is_premium_verified)
      lines.push(input.is_premium_verified ? "Włączono Premium Verified" : "Wyłączono Premium Verified")
    if (input.health_tags !== undefined && JSON.stringify(input.health_tags.sort()) !== JSON.stringify((current.health_tags as string[] ?? []).sort()))
      lines.push("Zaktualizowano tagi zdrowotne")
    if (input.species !== undefined && JSON.stringify(input.species.sort()) !== JSON.stringify((current.species as string[] ?? []).sort()))
      lines.push("Zmieniono gatunki")
    if (input.life_stage !== undefined && JSON.stringify(input.life_stage.sort()) !== JSON.stringify((current.life_stage as string[] ?? []).sort()))
      lines.push("Zaktualizowano etap życia")
    if (input.breed_tags !== undefined && JSON.stringify(input.breed_tags.sort()) !== JSON.stringify((current.breed_tags as string[] ?? []).sort()))
      lines.push("Zaktualizowano tagi ras")
    if ("category_id" in input && (input.category_id ?? null) !== (current.category_id ?? null))
      lines.push("Zmieniono kategorię")

    if (lines.length > 0) {
      await supabase.from("product_change_log").insert({
        product_id: id,
        summary: lines.join(" · "),
        source: "admin",
        changed_by: "Admin",
      })
    }
  }

  return { ok: true }
}

export type ChangelogEntry = {
  id: string
  changed_by: string
  source: string
  summary: string
  created_at: string
}

export async function getProductChangelog(productId: string): Promise<ChangelogEntry[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("product_change_log")
    .select("id, changed_by, source, summary, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(20)
  if (error) return []
  return data ?? []
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
      life_stage: input.life_stage ?? [],
      breed_tags: input.breed_tags ?? [],
      is_premium_verified: input.is_premium_verified ?? false,
      status: dbStatus,
      is_active: (input.stock ?? 0) > 0 && dbStatus === "active",
      category_id: input.category_id ?? null,
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
