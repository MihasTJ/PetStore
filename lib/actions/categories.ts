"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export type CategoryRow = {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .order("name", { ascending: true })
  if (error) {
    console.error("[admin] getCategories error:", error)
    return []
  }
  return data ?? []
}

export async function createCategory(
  name: string,
  customSlug?: string
): Promise<{ id: string } | { error: string }> {
  if (!name.trim()) return { error: "Nazwa kategorii jest wymagana." }
  const supabase = createAdminClient()
  const slug = customSlug?.trim() || toSlug(name.trim())
  if (!slug) return { error: "Nie można wygenerować sluga z tej nazwy." }
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: name.trim(), slug })
    .select("id")
    .single()
  if (error) {
    if (error.code === "23505") return { error: "Kategoria o tym slugu już istnieje." }
    return { error: error.message }
  }
  return { id: data.id }
}

export async function updateCategory(
  id: string,
  name: string,
  customSlug?: string
): Promise<{ ok: true } | { error: string }> {
  if (!name.trim()) return { error: "Nazwa kategorii jest wymagana." }
  const supabase = createAdminClient()
  const slug = customSlug?.trim() || toSlug(name.trim())
  if (!slug) return { error: "Nie można wygenerować sluga z tej nazwy." }
  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim(), slug })
    .eq("id", id)
  if (error) {
    if (error.code === "23505") return { error: "Kategoria o tym slugu już istnieje." }
    return { error: error.message }
  }
  return { ok: true }
}

export async function deleteCategory(id: string): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) return { error: error.message }
  return { ok: true }
}
