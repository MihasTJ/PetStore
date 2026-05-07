"use server"

import { createAdminClient } from "@/lib/supabase/admin"

// ── Endorsements ──────────────────────────────────────────────────────────────

export async function getProductEndorsement(productId: string): Promise<{
  endorsementId: string
  expertId: string
  quote: string
  validationDate: string | null
  expertName: string
  expertRole: string
  expertPhotoUrl: string | null
} | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("expert_endorsements")
    .select("id, expert_id, quote, validation_date, brand_experts(name, role, ai_generated_avatar_url)")
    .eq("product_id", productId)
    .maybeSingle()
  if (error || !data) return null
  const expert = data.brand_experts as { name: string; role: string; ai_generated_avatar_url: string | null } | null
  return {
    endorsementId: data.id,
    expertId: data.expert_id,
    quote: data.quote,
    validationDate: data.validation_date,
    expertName: expert?.name ?? "",
    expertRole: expert?.role ?? "",
    expertPhotoUrl: expert?.ai_generated_avatar_url ?? null,
  }
}

export async function saveProductEndorsement(
  productId: string,
  input: {
    expertId: string
    quote: string
    validationDate?: string
  }
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from("expert_endorsements")
    .select("id")
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from("expert_endorsements").update({
      expert_id: input.expertId,
      quote: input.quote,
      ...(input.validationDate ? { validation_date: input.validationDate } : {}),
    }).eq("id", existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("expert_endorsements").insert({
      product_id: productId,
      expert_id: input.expertId,
      quote: input.quote,
      ...(input.validationDate ? { validation_date: input.validationDate } : {}),
    })
    if (error) return { error: error.message }
  }

  return { ok: true }
}

export async function uploadExpertPhoto(formData: FormData): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File | null
  if (!file) return { error: "Brak pliku" }
  const expertId = (formData.get("expertId") as string | null) ?? `expert_${Date.now()}`

  const supabase = createAdminClient()
  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${expertId}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from("expert-photos")
    .upload(path, buffer, { contentType: file.type, upsert: true })
  if (error) return { error: error.message }

  const { data } = supabase.storage.from("expert-photos").getPublicUrl(path)
  return { url: data.publicUrl }
}

// ── Brand Experts CRUD ────────────────────────────────────────────────────────

export type ExpertRow = {
  id: string
  name: string
  role: string
  description: string | null
  specialization_tags: string[]
  ai_generated_avatar_url: string | null
  is_active: boolean
}

export async function getExperts(): Promise<ExpertRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("brand_experts")
    .select("id, name, role, description, specialization_tags, ai_generated_avatar_url, is_active")
    .order("name", { ascending: true })
  if (error) return []
  return (data ?? []) as ExpertRow[]
}

export async function createExpert(input: {
  name: string
  role: string
  description?: string
  specialization_tags?: string[]
}): Promise<{ id: string } | { error: string }> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("brand_experts")
    .insert({
      name: input.name,
      role: input.role,
      description: input.description ?? null,
      specialization_tags: input.specialization_tags ?? [],
      is_active: true,
    })
    .select("id")
    .single()
  if (error) return { error: error.message }
  return { id: data.id }
}

export async function updateExpert(
  id: string,
  input: {
    name?: string
    role?: string
    description?: string | null
    specialization_tags?: string[]
    is_active?: boolean
    ai_generated_avatar_url?: string | null
  }
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const updates: {
    name?: string
    role?: string
    description?: string | null
    specialization_tags?: string[]
    is_active?: boolean
    ai_generated_avatar_url?: string | null
  } = {}
  if (input.name !== undefined) updates.name = input.name
  if (input.role !== undefined) updates.role = input.role
  if (input.description !== undefined) updates.description = input.description
  if (input.specialization_tags !== undefined) updates.specialization_tags = input.specialization_tags
  if (input.is_active !== undefined) updates.is_active = input.is_active
  if (input.ai_generated_avatar_url !== undefined) updates.ai_generated_avatar_url = input.ai_generated_avatar_url
  const { error } = await supabase.from("brand_experts").update(updates).eq("id", id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function deleteExpert(id: string): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("brand_experts").delete().eq("id", id)
  if (error) return { error: error.message }
  return { ok: true }
}

// ── Certificates ──────────────────────────────────────────────────────────────

export async function getAllCertificates() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("product_certificates")
    .select("id, certificate_name, issuing_body, valid_until, file_url, product_id, products(name_seo, slug)")
    .order("created_at", { ascending: false })
  if (error) return []
  return (data ?? []) as {
    id: string
    certificate_name: string
    issuing_body: string | null
    valid_until: string | null
    file_url: string | null
    product_id: string
    products: { name_seo: string; slug: string } | null
  }[]
}

export async function getProductCertificates(productId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("product_certificates")
    .select("id, certificate_name, issuing_body, valid_until, file_url")
    .eq("product_id", productId)
    .order("created_at", { ascending: true })
  if (error) return []
  return data ?? []
}

export async function addProductCertificate(
  productId: string,
  input: { certificate_name: string; issuing_body?: string; valid_until?: string; file_url?: string }
): Promise<{ id: string } | { error: string }> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("product_certificates")
    .insert({
      product_id: productId,
      certificate_name: input.certificate_name,
      issuing_body: input.issuing_body ?? null,
      valid_until: input.valid_until ?? null,
      file_url: input.file_url ?? null,
    })
    .select("id")
    .single()
  if (error) return { error: error.message }
  return { id: data.id }
}

export async function deleteProductCertificate(id: string): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("product_certificates").delete().eq("id", id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function uploadCertificateFile(formData: FormData): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File | null
  const productId = formData.get("productId") as string | null
  if (!file || !productId) return { error: "Brak pliku lub produktu" }

  const supabase = createAdminClient()
  const path = `${productId}/${Date.now()}_${file.name}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from("product-certificates")
    .upload(path, buffer, { contentType: "application/pdf", upsert: false })
  if (error) return { error: error.message }

  const { data } = supabase.storage.from("product-certificates").getPublicUrl(path)
  return { url: data.publicUrl }
}
