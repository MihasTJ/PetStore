"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error: string | null;
  fieldErrors?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    petName?: string;
    species?: string;
    birthDate?: string;
    terms?: string;
  };
};

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Nieprawidłowy e-mail lub hasło." };
    }
    return { error: "Błąd logowania. Spróbuj ponownie." };
  }

  redirect("/konto");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = (formData.get("firstName") as string) || null;
  const lastName = (formData.get("lastName") as string) || null;
  const petName = formData.get("petName") as string;
  const species = formData.get("species") as "pies" | "kot" | "inny";
  const breed = (formData.get("breed") as string) || null;
  const birthDate = (formData.get("birthDate") as string) || null;
  const weightRaw = formData.get("weight") as string;
  const weightKg = weightRaw ? parseFloat(weightRaw) : null;
  const terms = formData.get("terms") as string;

  const fieldErrors: NonNullable<AuthState["fieldErrors"]> = {};
  if (!firstName?.trim()) fieldErrors.firstName = "Imię jest wymagane.";
  if (!lastName?.trim()) fieldErrors.lastName = "Nazwisko jest wymagane.";
  if (!email) fieldErrors.email = "Adres e-mail jest wymagany.";
  if (!password) fieldErrors.password = "Hasło jest wymagane.";
  else if (password.length < 8) fieldErrors.password = "Hasło musi mieć minimum 8 znaków.";
  if (!petName?.trim()) fieldErrors.petName = "Imię pupila jest wymagane.";
  if (!species) fieldErrors.species = "Gatunek jest wymagany.";
  if (!birthDate) fieldErrors.birthDate = "Data urodzenia jest wymagana.";
  if (!terms) fieldErrors.terms = "Musisz zaakceptować Regulamin i Politykę prywatności.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: null, fieldErrors };
  }

  // Trigger handle_new_user() creates customers + pet_profiles from metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        pet_name: petName || null,
        species: species || null,
        breed: breed || null,
        birth_date: birthDate || null,
        weight_kg: weightKg ?? null,
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Ten adres e-mail jest już zarejestrowany." };
    }
    return { error: "Błąd rejestracji. Spróbuj ponownie." };
  }

  revalidatePath("/konto");
  redirect("/konto");
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
