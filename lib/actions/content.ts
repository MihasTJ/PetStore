"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function upsertSiteContent(
  key: string,
  value: string
): Promise<{ success: true } | { error: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )

  if (error) return { error: error.message }
  return { success: true }
}

export async function getSiteContentByKeys(
  keys: string[]
): Promise<Record<string, string>> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", keys)

  const result: Record<string, string> = {}
  for (const row of data ?? []) {
    result[row.key] = row.value
  }
  return result
}
