export type Species = "pies" | "kot";
export type AgeStage = "szczenie" | "dorosly" | "senior";
export type ActivityLevel = "niska" | "umiarkowana" | "wysoka";
export type DietType = "sucha" | "mokra" | "domowe" | "premium";
export type HealthConcern = "stawy" | "siersc" | "trawienie" | "zeby" | "serce" | "waga";

export interface QuizData {
  species: Species | null;
  petName: string;
  breed: string;
  ageStage: AgeStage | null;
  activityLevel: ActivityLevel | null;
  dietType: DietType | null;
  healthConcerns: HealthConcern[];
}

export interface HealthArea {
  key: string;
  label: string;
  score: number;
  status: "dobry" | "uwaga" | "wymaga-wsparcia";
  insight: string;
  tagColor: string;
}

export interface ProductRecommendation {
  id: string;
  slug: string;
  name: string;
  reason: string;
  matchScore: number;
  price: string;
  healthTags: string[];
}

export interface QuizReport {
  petName: string;
  overallScore: number;
  overallLabel: string;
  healthAreas: HealthArea[];
  recommendations: ProductRecommendation[];
  nextSteps: string[];
  disclaimer: string;
}

function getStatus(score: number): "dobry" | "uwaga" | "wymaga-wsparcia" {
  if (score >= 80) return "dobry";
  if (score >= 60) return "uwaga";
  return "wymaga-wsparcia";
}

export function generateReport(data: QuizData): QuizReport {
  const name = data.petName.trim() || "Twój pupil";
  const isSenior = data.ageStage === "senior";
  const isPuppy = data.ageStage === "szczenie";

  // ── Health area scores ──────────────────────────────────────────
  let jointsScore = isPuppy ? 95 : isSenior ? 52 : 84;
  if (!isSenior && data.healthConcerns.includes("stawy")) jointsScore = Math.min(jointsScore, 58);

  let coatScore = 84;
  if (data.healthConcerns.includes("siersc")) coatScore = 46;
  else if (data.dietType === "sucha") coatScore = 68;

  let digestionScore = data.dietType === "premium" ? 91 : data.dietType === "domowe" ? 74 : 72;
  if (data.healthConcerns.includes("trawienie")) digestionScore = Math.min(digestionScore, 48);

  let weightScore = data.activityLevel === "wysoka" ? 93 : data.activityLevel === "umiarkowana" ? 80 : 60;
  if (data.healthConcerns.includes("waga")) weightScore = Math.min(weightScore, 50);

  const healthAreas: HealthArea[] = [
    {
      key: "stawy",
      label: "Stawy i mobilność",
      score: jointsScore,
      status: getStatus(jointsScore),
      insight:
        isSenior
          ? `Seniorzy wymagają wsparcia chrząstki stawowej — glukozamina i MSM dają najlepsze efekty podawane prewencyjnie od 6. roku życia.`
          : jointsScore < 70
          ? `Profil ${name} wskazuje na potrzebę wsparcia stawów — profilaktyka teraz zapobiega kosztownym problemom później.`
          : `Stawy ${name} są w dobrej kondycji. Profilaktyka po 5. roku życia utrzyma tę formę na lata.`,
      tagColor: "#A87B5C",
    },
    {
      key: "siersc",
      label: "Sierść i skóra",
      score: coatScore,
      status: getStatus(coatScore),
      insight:
        coatScore < 60
          ? `Problemy z sierścią często sygnalizują niedobór kwasów omega-3. Suplementacja EPA+DHA przynosi efekty już po 4–6 tygodniach.`
          : `Sierść ${name} jest w dobrej kondycji. Omega-3 z oleju rybiego utrzymają ją w świetnej formie.`,
      tagColor: "#7A6E5A",
    },
    {
      key: "trawienie",
      label: "Przewód pokarmowy",
      score: digestionScore,
      status: getStatus(digestionScore),
      insight:
        digestionScore < 60
          ? `Wrażliwy żołądek wymaga diety lekkostrawnej z probiotykami — właściwa mikroflora to fundament zdrowia.`
          : data.dietType === "premium"
          ? `Karma premium zapewnia zdrowy mikrobiom jelitowy ${name}. Doskonały wybór.`
          : `Karma premium zmniejsza ryzyko problemów żołądkowych — skład bez wypełniaczy robi różnicę.`,
      tagColor: "#9C8458",
    },
    {
      key: "waga",
      label: "Masa ciała i energia",
      score: weightScore,
      status: getStatus(weightScore),
      insight:
        data.activityLevel === "niska"
          ? `Niska aktywność zwiększa ryzyko nadwagi. Stopniowe zwiększenie ruchu chroni stawy i serce ${name}.`
          : `Poziom aktywności ${name} sprzyja utrzymaniu prawidłowej masy ciała — to świetna wiadomość.`,
      tagColor: "#5C7A6B",
    },
  ];

  // ── Recommendations ─────────────────────────────────────────────
  // Priority order: joints → coat/diet → digestion. Always pad to ≥2.
  const recommendations: ProductRecommendation[] = [];

  if (isSenior || jointsScore < 70) {
    recommendations.push({
      id: "suplement-stawy-glukozamina-kolagen",
      slug: "suplement-stawy-glukozamina-kolagen",
      name: "Suplement na stawy z glukozaminą i kolagenem",
      reason: isSenior
        ? `Profil seniora ${name} — glukozamina 500 mg, MSM i kolagen typ II to kombinacja klinicznie skuteczna przy problemach stawowych.`
        : `Wiek i profil zdrowotny ${name} wskazują na potrzebę wsparcia chrząstki. Działanie prewencyjne przynosi najlepsze efekty.`,
      matchScore: isSenior ? 96 : 88,
      price: "89,00 zł",
      healthTags: ["Stawy", "Senior", "Mobilność"],
    });
  }

  // Salmon karma: recommended for cats, coat concerns, or non-premium diet
  if (
    data.species === "kot" ||
    coatScore < 70 ||
    data.healthConcerns.includes("siersc") ||
    data.dietType === "sucha"
  ) {
    recommendations.push({
      id: "karma-premium-losos-norweski-kot",
      slug: "karma-premium-losos-norweski-kot",
      name: "Karma premium z norweskiego łososia",
      reason:
        data.species === "kot" || data.healthConcerns.includes("siersc")
          ? `Kwasy omega-3 EPA+DHA z norweskiego łososia przywracają blask sierści i nawilżenie skóry ${name}. Efekt widoczny po 4–6 tygodniach.`
          : `Zmiana z suchej karmy na karma premium z naturalnym białkiem poprawia trawienie, sierść i poziom energii ${name}.`,
      matchScore: data.healthConcerns.includes("siersc") ? 94 : data.species === "kot" ? 91 : 84,
      price: "64,00 zł",
      healthTags: ["Sierść", "Omega-3", "Skóra"],
    });
  }

  // Probiotic: for digestion issues or dry food without premium
  if (
    digestionScore < 75 ||
    data.healthConcerns.includes("trawienie") ||
    (data.dietType === "sucha" && data.species === "kot")
  ) {
    recommendations.push({
      id: "probiotyk-jelitowy-wrazliwe-koty",
      slug: "probiotyk-jelitowy-wrazliwe-koty",
      name: "Probiotyk jelitowy dla wrażliwych zwierząt",
      reason: `Kompleks probiotyczny z prebiotykami inuliny przywraca równowagę mikrobiomu jelitowego ${name} — bezpieczny też przy zmianie diety.`,
      matchScore: data.healthConcerns.includes("trawienie") ? 92 : 82,
      price: "72,00 zł",
      healthTags: ["Trawienie", "Mikrobiom", "Probiotyki"],
    });
  }

  // Always ensure at least 2 recommendations
  if (recommendations.length === 0) {
    recommendations.push({
      id: "suplement-stawy-glukozamina-kolagen",
      slug: "suplement-stawy-glukozamina-kolagen",
      name: "Suplement na stawy z glukozaminą i kolagenem",
      reason: `Profilaktyka stawów to inwestycja widoczna za 3–4 lata — zdrowy senior to mniej wizyt u weterynarza. ${name} zasługuje na to, by ich uniknąć.`,
      matchScore: 79,
      price: "89,00 zł",
      healthTags: ["Stawy", "Profilaktyka"],
    });
  }
  if (recommendations.length === 1) {
    recommendations.push({
      id: "probiotyk-jelitowy-wrazliwe-koty",
      slug: "probiotyk-jelitowy-wrazliwe-koty",
      name: "Probiotyk jelitowy dla wrażliwych zwierząt",
      reason: `Zdrowy mikrobiom jelitowy przekłada się na lepsze wchłanianie składników odżywczych i odporność ${name}.`,
      matchScore: 77,
      price: "72,00 zł",
      healthTags: ["Trawienie", "Mikrobiom"],
    });
  }

  // ── Next steps ──────────────────────────────────────────────────
  const nextSteps: string[] = [];
  if (isSenior) {
    nextSteps.push(`Badanie morfologiczne co 6 miesięcy — wczesna diagnoza to najskuteczniejsza profilaktyka dla seniora.`);
  }
  if (data.dietType !== "premium") {
    nextSteps.push(`Karma premium zmniejsza koszty weterynaryjne — skład bez wypełniaczy to lepsze przyswajanie składników odżywczych.`);
  }
  if (data.activityLevel === "niska") {
    nextSteps.push(`Nawet 10 minut spaceru więcej dziennie przekłada się na lepszą kondycję serca i prawidłową wagę.`);
  }
  if (nextSteps.length === 0) {
    nextSteps.push(`Regularne badania kontrolne raz w roku pozwalają wychwycić zmiany, zanim staną się problemem.`);
  }

  const overallScore = Math.round(
    healthAreas.reduce((s, a) => s + a.score, 0) / healthAreas.length
  );

  const overallLabel =
    overallScore >= 82
      ? "Bardzo dobry"
      : overallScore >= 65
      ? "Dobry — są obszary do wsparcia"
      : "Wymaga wsparcia";

  return {
    petName: name,
    overallScore,
    overallLabel,
    healthAreas,
    recommendations: recommendations.slice(0, 3),
    nextSteps,
    disclaimer: "Raport ma charakter informacyjny i nie zastępuje konsultacji weterynaryjnej. Najlepszą diagnozę postawi weterynarz Twojego pupila.",
  };
}
