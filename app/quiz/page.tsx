import type { Metadata } from "next";
import { HealthQuiz } from "@/components/quiz/health-quiz";

export const metadata: Metadata = {
  title: "Quiz zdrowotny — Premium Pet Care",
  description:
    "Sprawdź, czego potrzebuje Twój pupil. Bezpłatny quiz zdrowotny w 3 minuty — personalizowany raport i rekomendacje dobrane przez naszych Kuratorów.",
};

export default function QuizPage() {
  return <HealthQuiz />;
}
