import { createClient } from "@/lib/supabase/server";
import type { Database, HealthReport } from "@/types/database";
import type { QuizData, QuizReport } from "@/lib/quiz-engine";

type HealthReportInsert = Database["public"]["Tables"]["health_reports"]["Insert"];

export async function getHealthReports(petProfileId: string): Promise<HealthReport[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("health_reports")
    .select("*")
    .eq("pet_profile_id", petProfileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getLatestHealthReport(petProfileId: string): Promise<HealthReport | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("health_reports")
    .select("*")
    .eq("pet_profile_id", petProfileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveHealthReport(
  petProfileId: string,
  quizData: QuizData,
  report: QuizReport,
  orderId?: string
): Promise<HealthReport> {
  const supabase = await createClient();

  const payload: HealthReportInsert = {
    pet_profile_id: petProfileId,
    order_id: orderId ?? null,
    quiz_data: quizData as unknown as Database["public"]["Tables"]["health_reports"]["Insert"]["quiz_data"],
    recommendations: report.recommendations as unknown as Database["public"]["Tables"]["health_reports"]["Insert"]["recommendations"],
  };

  const { data, error } = await supabase
    .from("health_reports")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function parseQuizData(raw: unknown): QuizData | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as QuizData;
}

export function parseReportScore(recommendations: unknown): number {
  if (!Array.isArray(recommendations) || recommendations.length === 0) return 0;
  const scores = recommendations
    .filter((r) => typeof r?.matchScore === "number")
    .map((r) => r.matchScore as number);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
