"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface PetUpdatePayload {
  pet_name: string;
  species: "pies" | "kot" | "inny";
  breed: string | null;
  birth_date: string | null;
  weight_kg: number | null;
}

export async function updatePetProfileAction(
  id: string,
  payload: PetUpdatePayload
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Brak sesji." };

  const { error } = await supabase
    .from("pet_profiles")
    .update(payload)
    .eq("id", id)
    .eq("customer_id", user.id);

  if (error) return { error: "Błąd zapisu. Spróbuj ponownie." };

  revalidatePath("/konto");
  return { error: null };
}
