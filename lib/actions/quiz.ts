"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateReport, type QuizData } from "@/lib/quiz-engine";
import {
  getPetProfile,
  updatePetProfile,
  createPetProfile,
} from "@/lib/supabase/queries/pet-profiles";
import { saveHealthReport } from "@/lib/supabase/queries/health-reports";

export async function submitQuiz(quizData: QuizData): Promise<{ saved: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { saved: false };

  const report = generateReport(quizData);

  try {
    let pet = await getPetProfile(user.id);

    const nameUpdate = quizData.petName.trim();
    const speciesIsValid =
      quizData.species === "pies" || quizData.species === "kot";

    if (pet) {
      await updatePetProfile(pet.id, {
        ...(nameUpdate && { pet_name: nameUpdate }),
        ...(speciesIsValid && { species: quizData.species! }),
        breed: quizData.breed || null,
      });
    } else if (nameUpdate && speciesIsValid) {
      pet = await createPetProfile(
        {
          pet_name: nameUpdate,
          species: quizData.species as "pies" | "kot" | "inny",
          breed: quizData.breed || null,
        },
        user.id
      );
    }

    if (pet) {
      await saveHealthReport(pet.id, quizData, report);
    }
  } catch (err) {
    console.error("[submitQuiz] failed:", err);
    return { saved: false };
  }

  revalidatePath("/konto");
  return { saved: true };
}
