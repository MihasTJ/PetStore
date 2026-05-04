"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Shield, Info, BadgeCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BreedCombobox } from "@/components/breed-combobox";
import {
  generateReport,
  type Species,
  type AgeStage,
  type ActivityLevel,
  type DietType,
  type HealthConcern,
  type QuizData,
  type QuizReport,
  type HealthArea,
  type ProductRecommendation,
} from "@/lib/quiz-engine";
import { submitQuiz } from "@/lib/actions/quiz";

// ── Types ───────────────────────────────────────────────────────────
type Step =
  | "welcome"
  | "species"
  | "profile"
  | "age"
  | "activity"
  | "diet"
  | "concerns"
  | "results";

const STEP_NUMBERS: Partial<Record<Step, number>> = {
  species: 1,
  profile: 2,
  age: 3,
  activity: 4,
  diet: 5,
  concerns: 6,
};

const STEP_ORDER: Step[] = [
  "welcome",
  "species",
  "profile",
  "age",
  "activity",
  "diet",
  "concerns",
  "results",
];

// ── Breed autocomplete ───────────────────────────────────────────────
// ── Primitives ──────────────────────────────────────────────────────
function ProgressBar({ step }: { step: Step }) {
  const num = STEP_NUMBERS[step];
  if (!num) return null;
  const pct = (num / 6) * 100;

  return (
    <div className="mb-10 md:mb-12">
      <p className="mb-3 text-[11px] font-medium tracking-eyebrow text-ink-muted uppercase">
        Krok {num} / 6
      </p>
      <div className="h-[5px] w-full rounded-full bg-border-warm overflow-hidden">
        <div
          className="h-full rounded-full bg-terracotta transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
  icon?: React.ReactNode;
}

function OptionCard({ selected, onClick, label, sub, icon }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-card-sm p-5 text-left transition-all duration-200 border-2 cursor-pointer",
        "bg-card-warm shadow-warm hover:shadow-warm-md",
        selected
          ? "border-terracotta"
          : "border-transparent hover:border-border-warm"
      )}
      style={selected ? { backgroundColor: "rgba(184,101,74,0.04)" } : undefined}
    >
      {icon && (
        <div className="mb-3 text-ink-subtle">{icon}</div>
      )}
      <p
        className={cn(
          "text-base font-medium",
          selected ? "text-terracotta" : "text-ink"
        )}
      >
        {label}
      </p>
      {sub && (
        <p className="mt-1 text-[13px] leading-body text-ink-muted">{sub}</p>
      )}
    </button>
  );
}

function NavRow({
  onBack,
  onNext,
  nextLabel = "Dalej",
  nextDisabled = false,
  isFirst = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isFirst?: boolean;
}) {
  return (
    <div className="mt-10 flex items-center justify-between">
      {!isFirst ? (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ChevronLeft size={16} />
          Wróć
        </button>
      ) : (
        <span />
      )}

      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "flex items-center gap-2 rounded-button px-7 py-3 text-sm font-medium transition-colors",
          nextDisabled
            ? "bg-border-warm text-ink-subtle cursor-not-allowed"
            : "bg-terracotta text-card-warm hover:bg-terracotta-hover cursor-pointer"
        )}
      >
        {nextLabel}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Individual Steps ────────────────────────────────────────────────
function StepSpecies({
  value,
  onChange,
}: {
  value: Species | null;
  onChange: (v: Species) => void;
}) {
  return (
    <div>
      <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
        Czy Twój pupil to...
      </h2>
      <p className="mt-4 text-base leading-body text-ink-muted">
        Dobieramy rekomendacje pod konkretny gatunek i jego potrzeby zdrowotne.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <OptionCard
          selected={value === "pies"}
          onClick={() => onChange("pies")}
          label="Pies"
          sub="Karma, suplementy i profilaktyka dla psów"
        />
        <OptionCard
          selected={value === "kot"}
          onClick={() => onChange("kot")}
          label="Kot"
          sub="Karma, suplementy i profilaktyka dla kotów"
        />
      </div>
    </div>
  );
}

function StepProfile({
  petName,
  breed,
  species,
  onChangeName,
  onChangeBreed,
}: {
  petName: string;
  breed: string;
  species: Species | null;
  onChangeName: (v: string) => void;
  onChangeBreed: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
        Poznajmy się
      </h2>
      <p className="mt-4 text-base leading-body text-ink-muted">
        Imię i rasa pozwalają nam dopasować rekomendacje do predyspozycji zdrowotnych
        konkretnej rasy.
      </p>
      <div className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Jak ma na imię?
          </label>
          <input
            type="text"
            value={petName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder={species === "kot" ? "np. Zuzia" : "np. Max"}
            className="w-full rounded-field border border-border-warm bg-card-warm px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Jakiej jest rasy?{" "}
            <span className="text-ink-subtle font-normal">(opcjonalnie)</span>
          </label>
          <BreedCombobox
            value={breed}
            onChange={onChangeBreed}
            species={species}
            placeholder={species === "kot" ? "np. europejski, ragdoll, perski" : "np. golden retriever, mieszaniec"}
          />
        </div>
      </div>
    </div>
  );
}

function StepAge({
  value,
  petName,
  species,
  onChange,
}: {
  value: AgeStage | null;
  petName: string;
  species: Species | null;
  onChange: (v: AgeStage) => void;
}) {
  const name = petName || "Twój pupil";
  const options: { value: AgeStage; label: string; sub: string }[] = [
    { value: "szczenie", label: species === "pies" ? "Szczenię" : species === "kot" ? "Kocię" : "Szczenię / Kocię", sub: "Poniżej 1 roku życia" },
    { value: "dorosly", label: "Dorosły", sub: "1–6 lat" },
    { value: "senior", label: "Senior", sub: "7 lat i więcej" },
  ];

  return (
    <div>
      <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
        Ile ma lat {name === "Twój pupil" ? name : <em className="not-italic text-terracotta">{name}</em>}?
      </h2>
      <p className="mt-4 text-base leading-body text-ink-muted">
        Etap życia decyduje o potrzebach żywieniowych i profilaktycznych.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            label={opt.label}
            sub={opt.sub}
          />
        ))}
      </div>
    </div>
  );
}

function StepActivity({
  value,
  petName,
  onChange,
}: {
  value: ActivityLevel | null;
  petName: string;
  onChange: (v: ActivityLevel) => void;
}) {
  const name = petName || "Twój pupil";
  const options: { value: ActivityLevel; label: string; sub: string }[] = [
    { value: "niska", label: "Spokojna", sub: "Głównie w domu, krótkie spacery" },
    { value: "umiarkowana", label: "Umiarkowana", sub: "Regularne spacery, zabawa" },
    { value: "wysoka", label: "Aktywna", sub: "Długie spacery, sporty, bieganie" },
  ];

  return (
    <div>
      <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
        Jak aktywna jest{" "}
        {name === "Twój pupil" ? (
          name
        ) : (
          <em className="not-italic text-terracotta">{name}</em>
        )}
        ?
      </h2>
      <p className="mt-4 text-base leading-body text-ink-muted">
        Poziom aktywności wpływa na zapotrzebowanie kaloryczne i ryzyko nadwagi.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            label={opt.label}
            sub={opt.sub}
          />
        ))}
      </div>
    </div>
  );
}

function StepDiet({
  value,
  petName,
  onChange,
}: {
  value: DietType | null;
  petName: string;
  onChange: (v: DietType) => void;
}) {
  const name = petName || "Twój pupil";
  const options: { value: DietType; label: string; sub: string }[] = [
    { value: "sucha", label: "Sucha karma", sub: "Granulat ze sklepu ogólnego" },
    { value: "mokra", label: "Mokra karma", sub: "Puszki lub saszetki" },
    { value: "premium", label: "Karma premium", sub: "Weterynaryjnie zweryfikowany skład" },
    { value: "domowe", label: "Domowe żywienie", sub: "Przygotowywane samodzielnie" },
  ];

  return (
    <div>
      <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
        Co je{" "}
        {name === "Twój pupil" ? (
          name
        ) : (
          <em className="not-italic text-terracotta">{name}</em>
        )}
        ?
      </h2>
      <p className="mt-4 text-base leading-body text-ink-muted">
        Dieta to fundament — wpływa na trawienie, sierść, poziom energii i długowieczność.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            label={opt.label}
            sub={opt.sub}
          />
        ))}
      </div>
    </div>
  );
}

const CONCERN_OPTIONS: { value: HealthConcern; label: string; color: string }[] = [
  { value: "stawy", label: "Stawy", color: "#A87B5C" },
  { value: "siersc", label: "Sierść", color: "#7A6E5A" },
  { value: "trawienie", label: "Trawienie", color: "#9C8458" },
  { value: "zeby", label: "Zęby", color: "#8B7355" },
  { value: "serce", label: "Serce", color: "#9C5447" },
  { value: "waga", label: "Waga", color: "#5C7A6B" },
];

function StepConcerns({
  value,
  petName,
  onChange,
}: {
  value: HealthConcern[];
  petName: string;
  onChange: (v: HealthConcern[]) => void;
}) {
  const name = petName || "Twój pupil";

  function toggle(concern: HealthConcern) {
    if (value.includes(concern)) {
      onChange(value.filter((c) => c !== concern));
    } else {
      onChange([...value, concern]);
    }
  }

  return (
    <div>
      <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
        Co chcesz monitorować u{" "}
        {name === "Twój pupil" ? (
          name
        ) : (
          <em className="not-italic text-terracotta">{name}</em>
        )}
        ?
      </h2>
      <p className="mt-4 text-base leading-body text-ink-muted">
        Wybierz obszary zdrowia, które chcesz szczególnie wziąć pod uwagę. Możesz wybrać
        kilka lub pominąć.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {CONCERN_OPTIONS.map((opt) => {
          const sel = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={cn(
                "rounded-tag px-4 py-2.5 text-sm font-medium transition-all duration-200 border-2 cursor-pointer",
                sel ? "border-transparent" : "border-border-warm bg-card-warm text-ink hover:border-border-warm"
              )}
              style={
                sel
                  ? {
                      backgroundColor: `${opt.color}18`,
                      color: opt.color,
                      borderColor: opt.color,
                    }
                  : undefined
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-[13px] text-ink-subtle">
        Nie musisz nic wybierać — quiz uwzględni też ogólne predyspozycje rasy i wieku.
      </p>
    </div>
  );
}

// ── Results ─────────────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
  const [count, setCount] = useState(0);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = (count / 100) * circ;

  useEffect(() => {
    let raf: number;
    const duration = 1000;
    const delay = 200;
    const startTime = performance.now() + delay;

    function tick(now: number) {
      if (now < startTime) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center w-28 h-28">
      <svg className="absolute inset-0 -rotate-90" width={112} height={112} viewBox="0 0 112 112">
        <circle cx={56} cy={56} r={r} fill="none" stroke="#E8E2D6" strokeWidth={5} />
        <circle
          cx={56}
          cy={56}
          r={r}
          fill="none"
          stroke="#B8654A"
          strokeWidth={5}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="font-tnum text-3xl font-medium text-ink leading-none">{count}</span>
    </div>
  );
}

function HealthAreaBar({ area, index }: { area: HealthArea; index: number }) {
  const [width, setWidth] = useState(0);
  const statusLabel = {
    dobry: "Dobry",
    uwaga: "Wymaga uwagi",
    "wymaga-wsparcia": "Wymaga wsparcia",
  }[area.status];

  useEffect(() => {
    const timer = setTimeout(() => setWidth(area.score), 350 + index * 150);
    return () => clearTimeout(timer);
  }, [area.score, index]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-ink">{area.label}</span>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-medium rounded-tag px-2 py-0.5"
            style={{
              backgroundColor: `${area.tagColor}14`,
              color: area.tagColor,
            }}
          >
            {statusLabel}
          </span>
          <span className="font-tnum text-sm font-medium text-ink">{area.score}%</span>
        </div>
      </div>
      <div className="h-[5px] w-full rounded-full bg-border-warm overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: area.tagColor,
            transition: "width 0.8s cubic-bezier(0.33, 1, 0.68, 1)",
          }}
        />
      </div>
      <p className="mt-2 text-[13px] leading-body text-ink-muted">{area.insight}</p>
    </div>
  );
}

function RecommendationCard({ rec, petName }: { rec: ProductRecommendation; petName: string }) {
  const name = petName === "Twój pupil" ? "pupila" : petName;
  return (
    <div className="bg-card-warm rounded-card-sm p-5 shadow-warm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[11px] font-medium tracking-eyebrow text-moss uppercase flex items-center gap-1"
            >
              <BadgeCheck size={12} />
              {rec.matchScore}% dopasowania
            </span>
          </div>
          <h4 className="font-serif font-normal text-xl text-ink leading-tight">
            {rec.name}
          </h4>
        </div>
        <p className="font-tnum text-xl font-medium text-ink shrink-0">{rec.price}</p>
      </div>

      <p className="text-[13px] leading-body text-ink-muted">{rec.reason}</p>

      <div className="flex flex-wrap gap-1.5">
        {rec.healthTags.map((tag) => (
          <span
            key={tag}
            className="rounded-tag px-2.5 py-1 text-[11px] font-medium bg-warm-island text-ink-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={`/products/${rec.slug}`}
        className="mt-auto inline-flex items-center justify-center rounded-button bg-terracotta px-5 py-2.5 text-sm font-medium text-card-warm hover:bg-terracotta-hover transition-colors"
      >
        Dodaj dla pupila
        <ChevronRight size={15} className="ml-1.5" />
      </a>
    </div>
  );
}

function Results({
  report,
  saved,
  onRestart,
}: {
  report: QuizReport;
  saved: boolean;
  onRestart: () => void;
}) {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="mb-3 text-[11px] font-medium tracking-eyebrow text-moss uppercase flex items-center gap-1.5">
          <Shield size={12} />
          Raport zdrowotny
          {saved && (
            <span className="ml-2 flex items-center gap-1 text-moss normal-case tracking-normal font-normal">
              <Check size={11} strokeWidth={2} />
              Zapisano w profilu
            </span>
          )}
        </p>
        <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
          Profil zdrowotny{" "}
          {report.petName === "Twój pupil" ? (
            report.petName
          ) : (
            <em className="not-italic text-terracotta">{report.petName}</em>
          )}
        </h2>
      </div>

      {/* Overall score */}
      <div className="bg-card-warm rounded-card p-6 shadow-warm mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <ScoreCircle score={report.overallScore} />
        <div>
          <p className="text-xs font-medium tracking-eyebrow text-ink-muted uppercase mb-1">
            Ogólna ocena zdrowia
          </p>
          <p className="font-serif text-2xl text-ink leading-editorial">{report.overallLabel}</p>
          <p className="mt-2 text-sm leading-body text-ink-muted">
            Na podstawie {report.healthAreas.length} obszarów zdrowia. Raport uwzględnia
            wiek, aktywność, dietę i obserwowane potrzeby.
          </p>
        </div>
      </div>

      {/* Health areas */}
      <div className="bg-card-warm rounded-card p-6 shadow-warm mb-6 space-y-7">
        <p className="text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Analiza obszarów zdrowia
        </p>
        {report.healthAreas.map((area, i) => (
          <HealthAreaBar key={area.key} area={area} index={i} />
        ))}
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Dobrane dla Twojego pupila
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {report.recommendations.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} petName={report.petName} />
          ))}
        </div>
      </div>

      {/* Next steps */}
      {report.nextSteps.length > 0 && (
        <div className="bg-card-warm rounded-card p-6 shadow-warm mb-6">
          <p className="text-xs font-medium tracking-eyebrow text-ink-muted uppercase mb-4">
            Wskazówki zdrowotne
          </p>
          <ul className="space-y-3">
            {report.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 mt-1 w-5 h-5 rounded-full bg-warm-island flex items-center justify-center text-[10px] font-medium text-ink-muted">
                  {i + 1}
                </span>
                <p className="text-sm leading-body text-ink-muted">{step}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-field bg-warm-island px-4 py-3 mb-8">
        <Info size={14} className="shrink-0 mt-0.5 text-ink-subtle" />
        <p className="text-[12px] leading-body text-ink-muted italic">{report.disclaimer}</p>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <a
          href="/#produkty"
          className="w-full sm:w-auto flex items-center justify-center rounded-button bg-terracotta px-8 py-3.5 text-sm font-medium text-card-warm hover:bg-terracotta-hover transition-colors"
        >
          Zobacz wszystkie produkty
        </a>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center rounded-button border border-border-warm px-8 py-3.5 text-sm font-medium text-ink-muted hover:text-ink hover:border-ink-muted transition-colors"
        >
          Wypełnij quiz ponownie
        </button>
      </div>
    </div>
  );
}

// ── Welcome screen ───────────────────────────────────────────────────
function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <p className="mb-6 text-xs font-medium tracking-eyebrow text-moss uppercase">
        Bezpłatny quiz zdrowotny
      </p>
      <h1 className="font-serif font-normal leading-editorial text-ink text-4xl md:text-5xl">
        Sprawdź, czego potrzebuje
        <br />
        Twój pupil.
      </h1>
      <p className="mt-8 max-w-prose text-base leading-body text-ink-muted">
        Odpowiedz na 6 pytań o swojego pupila — dostaniesz spersonalizowany raport zdrowotny
        i rekomendacje produktów dopasowane do jego rasy, wieku i potrzeb.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-start gap-6">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
        >
          Rozpocznij quiz
          <ChevronRight size={16} />
        </button>
        <div className="flex flex-col gap-1.5 text-sm text-ink-muted">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-ink-subtle" />
            6 pytań, ok. 3 minuty
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-ink-subtle" />
            Spersonalizowany raport zdrowotny
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-ink-subtle" />
            Bez rejestracji, bez zobowiązań
          </span>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-3 gap-6 pt-10 border-t border-border-warm">
        {[
          { num: "94%", label: "rodziców pupili widzi różnicę po 4 tygodniach" },
          { num: "3 min", label: "wystarczą na wypełnienie quizu" },
          { num: "100%", label: "rekomendacji weterynaryjnie zweryfikowanych" },
        ].map((stat) => (
          <div key={stat.num}>
            <p className="font-tnum text-2xl md:text-3xl font-medium text-terracotta">
              {stat.num}
            </p>
            <p className="mt-1 text-[13px] leading-body text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────
const INITIAL_DATA: QuizData = {
  species: null,
  petName: "",
  breed: "",
  ageStage: null,
  activityLevel: null,
  dietType: null,
  healthConcerns: [],
};

export function HealthQuiz() {
  const [step, setStep] = useState<Step>("welcome");
  const [data, setData] = useState<QuizData>(INITIAL_DATA);
  const [report, setReport] = useState<QuizReport | null>(null);
  const [saved, setSaved] = useState(false);

  async function advance() {
    const idx = STEP_ORDER.indexOf(step);
    const next = STEP_ORDER[idx + 1];
    if (next === "results") {
      setReport(generateReport(data));
      setSaved(false);
      submitQuiz(data).then((res) => {
        if (res.saved) setSaved(true);
      });
      if (data.petName.trim()) {
        try { localStorage.setItem("quiz_pet_name", data.petName.trim()); } catch {}
      }
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retreat() {
    const idx = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[idx - 1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setStep("welcome");
    setData(INITIAL_DATA);
    setReport(null);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const canAdvance: Record<Step, boolean> = {
    welcome: true,
    species: data.species !== null,
    profile: data.petName.trim().length > 0,
    age: data.ageStage !== null,
    activity: data.activityLevel !== null,
    diet: data.dietType !== null,
    concerns: true,
    results: true,
  };

  return (
    <main className="min-h-screen bg-tech-island">
      <div className="mx-auto max-w-editorial px-6 pt-20 pb-24 md:px-12 md:pt-32 md:pb-40">
        {step !== "welcome" && step !== "results" && <ProgressBar step={step} />}

        {step === "welcome" && <Welcome onStart={advance} />}

        {step === "species" && (
          <>
            <StepSpecies
              value={data.species}
              onChange={(v) => setData({ ...data, species: v })}
            />
            <NavRow
              onBack={retreat}
              onNext={advance}
              nextDisabled={!canAdvance.species}
              isFirst
            />
          </>
        )}

        {step === "profile" && (
          <>
            <StepProfile
              petName={data.petName}
              breed={data.breed}
              species={data.species}
              onChangeName={(v) => setData({ ...data, petName: v })}
              onChangeBreed={(v) => setData({ ...data, breed: v })}
            />
            <NavRow
              onBack={retreat}
              onNext={advance}
              nextDisabled={!canAdvance.profile}
            />
          </>
        )}

        {step === "age" && (
          <>
            <StepAge
              value={data.ageStage}
              petName={data.petName}
              species={data.species}
              onChange={(v) => setData({ ...data, ageStage: v })}
            />
            <NavRow
              onBack={retreat}
              onNext={advance}
              nextDisabled={!canAdvance.age}
            />
          </>
        )}

        {step === "activity" && (
          <>
            <StepActivity
              value={data.activityLevel}
              petName={data.petName}
              onChange={(v) => setData({ ...data, activityLevel: v })}
            />
            <NavRow
              onBack={retreat}
              onNext={advance}
              nextDisabled={!canAdvance.activity}
            />
          </>
        )}

        {step === "diet" && (
          <>
            <StepDiet
              value={data.dietType}
              petName={data.petName}
              onChange={(v) => setData({ ...data, dietType: v })}
            />
            <NavRow
              onBack={retreat}
              onNext={advance}
              nextDisabled={!canAdvance.diet}
            />
          </>
        )}

        {step === "concerns" && (
          <>
            <StepConcerns
              value={data.healthConcerns}
              petName={data.petName}
              onChange={(v) => setData({ ...data, healthConcerns: v })}
            />
            <NavRow
              onBack={retreat}
              onNext={advance}
              nextLabel="Zobacz raport"
            />
          </>
        )}

        {step === "results" && report && (
          <Results report={report} saved={saved} onRestart={restart} />
        )}
      </div>
    </main>
  );
}
