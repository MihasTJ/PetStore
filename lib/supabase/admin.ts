import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Service-role client — bypasses RLS. Server-side only, never expose to client.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      // Explicitly set Authorization so the auth module cannot override it
      // with an empty/anon token when there is no active session.
      global: { headers: { Authorization: `Bearer ${key}` } },
    }
  );
}
