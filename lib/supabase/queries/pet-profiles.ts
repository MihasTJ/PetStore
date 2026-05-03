import { createClient } from "@/lib/supabase/server";
import type { Database, PetProfile } from "@/types/database";

type PetProfileInsert = Database["public"]["Tables"]["pet_profiles"]["Insert"];
type PetProfileUpdate = Database["public"]["Tables"]["pet_profiles"]["Update"];

export async function getPetProfile(customerId: string): Promise<PetProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pet_profiles")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPetProfiles(customerId: string): Promise<PetProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pet_profiles")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createPetProfile(
  payload: Omit<PetProfileInsert, "customer_id">,
  customerId: string
): Promise<PetProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pet_profiles")
    .insert({ ...payload, customer_id: customerId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePetProfile(
  id: string,
  payload: PetProfileUpdate
): Promise<PetProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pet_profiles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function calcAgeLabel(birthDate: string | null): string {
  if (!birthDate) return "Nieznany";
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} mies.`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 rok" : `${years} lata`;
}
