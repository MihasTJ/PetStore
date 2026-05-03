"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  BellOff,
  Clock,
  Leaf,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Settings,
  Mail,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";

// Docelowo: SELECT z ai_alerts WHERE customer_id = auth.uid() ORDER BY scheduled_at DESC
const MOCK_ACTIVE_ALERTS = [
  {
    id: 1,
    type: "supplement_end" as const,
    urgency: "high" as const,
    title: "Kończy się suplement na stawy",
    message:
      "Zostało mniej niż 5 dni suplementu na stawy. Na podstawie historii zakupów — kolejna paczka wystarczy na 3 miesiące.",
    actionLabel: "Zamów kolejną porcję",
    href: "/produkty",
    scheduledAt: "Dziś",
    productName: "Suplement na stawy Senior — 90 kapsułek",
  },
  {
    id: 2,
    type: "life_stage" as const,
    urgency: "medium" as const,
    title: "Nowy etap życia — czas na zmiany w diecie",
    message:
      "W 3. roku życia kotka przechodzi do fazy dorosłej — dieta i suplementacja powinny się zmienić. Zalecamy rozważenie profilaktyki zębowej i przegląd składu karmy.",
    actionLabel: "Zobacz rekomendacje dla 3-latki",
    href: "/produkty",
    scheduledAt: "2 dni temu",
    productName: null,
  },
  {
    id: 3,
    type: "new_product" as const,
    urgency: "info" as const,
    title: "Nowy produkt lepiej dopasowany do profilu zdrowotnego",
    message:
      "Do asortymentu trafiła karma z norweskiego łososia z dodatkowym omega-3 — lepiej dopasowana do aktualnego profilu zdrowotnego niż Twój obecny wybór.",
    actionLabel: "Porównaj z obecną karmą",
    href: "/produkty",
    scheduledAt: "5 dni temu",
    productName: "Karma premium Salmon Nordic — 2 kg",
  },
];

const MOCK_PAST_ALERTS = [
  {
    id: 4,
    type: "health_risk" as const,
    urgency: "medium" as const,
    title: "Predyspozycja rasowa — waga",
    scheduledAt: "3 tygodnie temu",
  },
  {
    id: 5,
    type: "supplement_end" as const,
    urgency: "high" as const,
    title: "Skończyły się przysmaki dentystyczne",
    scheduledAt: "6 tygodni temu",
  },
];

const INITIAL_PREFS = {
  supplement_end: true,
  life_stage: true,
  health_risk: true,
  new_product: false,
  channel_email: true,
  channel_push: false,
};

type AlertType = "supplement_end" | "life_stage" | "new_product" | "health_risk";
type Urgency = "high" | "medium" | "info";
type PrefKey = keyof typeof INITIAL_PREFS;

const ALERT_CONFIG: Record<
  AlertType,
  { label: string; Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }> }
> = {
  supplement_end: { label: "Koniec suplementu", Icon: Clock },
  life_stage: { label: "Etap życia", Icon: Leaf },
  new_product: { label: "Nowy produkt", Icon: Sparkles },
  health_risk: { label: "Ryzyko zdrowotne", Icon: AlertTriangle },
};

const URGENCY_STYLES: Record<
  Urgency,
  { card: string; iconBg: string; icon: string }
> = {
  high: {
    card: "bg-card-warm border border-terracotta/25",
    iconBg: "bg-terracotta/10",
    icon: "text-terracotta",
  },
  medium: {
    card: "bg-tech-island border border-border-warm",
    iconBg: "bg-warm-island",
    icon: "text-ink-muted",
  },
  info: {
    card: "bg-tech-island border border-border-warm",
    iconBg: "bg-warm-island",
    icon: "text-moss",
  },
};

const ALERT_TYPES_SETTINGS = [
  {
    key: "supplement_end" as const,
    Icon: Clock,
    title: "Koniec suplementu",
    desc: "Przypomnienie 5 dni przed wyczerpaniem zapasu.",
  },
  {
    key: "life_stage" as const,
    Icon: Leaf,
    title: "Nowy etap życia",
    desc: "Zmiana potrzeb żywieniowych przy kolejnym etapie życia.",
  },
  {
    key: "health_risk" as const,
    Icon: AlertTriangle,
    title: "Ryzyko zdrowotne rasy",
    desc: "Alert prewencyjny dopasowany do rasy i wieku pupila.",
  },
  {
    key: "new_product" as const,
    Icon: Sparkles,
    title: "Nowy produkt w asortymencie",
    desc: "Gdy pojawi się coś lepiej dopasowanego do profilu zdrowotnego pupila.",
  },
] as const;

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 ${
        checked ? "bg-terracotta" : "bg-border-warm"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-card-warm shadow-warm transition-transform duration-200 mt-0.5 ${
          checked ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function ActiveAlertCard({ alert }: { alert: (typeof MOCK_ACTIVE_ALERTS)[0] }) {
  const config = ALERT_CONFIG[alert.type];
  const styles = URGENCY_STYLES[alert.urgency];
  const { Icon } = config;

  return (
    <article className={`rounded-card p-6 md:p-7 ${styles.card}`}>
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-10 h-10 rounded-field flex items-center justify-center ${styles.iconBg}`}>
          <Icon size={18} strokeWidth={1.5} className={styles.icon} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium tracking-eyebrow uppercase ${styles.icon}`}>
              {config.label}
            </span>
            <span className="text-xs text-ink-subtle">·</span>
            <span className="text-xs text-ink-subtle">{alert.scheduledAt}</span>
          </div>

          <h3 className="font-serif font-normal text-xl text-ink mb-2 leading-snug">
            {alert.title}
          </h3>
          <p className="text-sm leading-body text-ink-muted mb-4">{alert.message}</p>

          {alert.productName && (
            <div className="flex items-center gap-2 mb-4 py-2.5 px-3 rounded-field bg-warm-island/60">
              <ShieldCheck size={13} strokeWidth={1.5} className="text-moss shrink-0" />
              <span className="text-xs text-ink-muted">{alert.productName}</span>
            </div>
          )}

          <Link
            href={alert.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-hover transition-colors"
          >
            {alert.actionLabel}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function PastAlertRow({ alert }: { alert: (typeof MOCK_PAST_ALERTS)[0] }) {
  const config = ALERT_CONFIG[alert.type];
  const { Icon } = config;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border-warm last:border-0">
      <div className="shrink-0 w-8 h-8 rounded-field bg-warm-island flex items-center justify-center">
        <Icon size={14} strokeWidth={1.5} className="text-ink-subtle" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-muted">{alert.title}</p>
        <p className="text-xs text-ink-subtle mt-0.5">{alert.scheduledAt}</p>
      </div>
      <BellOff size={13} strokeWidth={1.5} className="shrink-0 text-ink-subtle" />
    </div>
  );
}

export default function AlertyPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [saved, setSaved] = useState(false);

  function togglePref(key: PrefKey) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  }

  function handleSave() {
    // Docelowo: UPDATE notification_preferences SET ... WHERE customer_id = auth.uid()
    setSaved(true);
  }

  const hasActive = MOCK_ACTIVE_ALERTS.length > 0;

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[720px] px-6 pt-28 pb-24 md:px-8 md:pt-36">

        {/* Breadcrumb */}
        <Link
          href="/konto"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Wróć do konta
        </Link>

        {/* Nagłówek strony */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={14} strokeWidth={1.5} className="text-ink-subtle" />
            <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
              Alerty zdrowotne
            </p>
          </div>
          <h1 className="font-serif font-normal text-4xl md:text-5xl text-ink leading-editorial mb-3">
            Dbamy o Zuzię razem.
          </h1>
          <p className="text-base leading-body text-ink-muted max-w-lg">
            Obserwujemy wiek, historię zakupów i profil zdrowotny Twojego pupila —
            i informujemy Cię, zanim pojawi się problem.
          </p>
        </div>

        {/* Aktywne alerty */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle flex items-center gap-2">
              Aktywne
              {hasActive && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-terracotta text-card-warm text-[10px] font-medium font-tnum">
                  {MOCK_ACTIVE_ALERTS.length}
                </span>
              )}
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowSettings((v) => !v);
                setSaved(false);
              }}
              className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              {showSettings ? (
                <>
                  <X size={13} strokeWidth={1.5} />
                  Zamknij ustawienia
                </>
              ) : (
                <>
                  <Settings size={13} strokeWidth={1.5} />
                  Ustawienia alertów
                </>
              )}
            </button>
          </div>

          {/* Panel ustawień — inline */}
          {showSettings && (
            <div className="mb-6 bg-tech-island rounded-card p-6 md:p-7 animate-in fade-in slide-in-from-top-2 duration-200">
              <h3 className="font-serif font-normal text-xl text-ink mb-6">
                Ustawienia alertów
              </h3>

              {/* Typy alertów */}
              <div className="mb-6">
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-4">
                  Typy alertów
                </p>
                <div className="divide-y divide-border-warm">
                  {ALERT_TYPES_SETTINGS.map(({ key, Icon, title, desc }) => (
                    <div key={key} className="flex items-center gap-4 px-5 py-4">
                      <div className="shrink-0 w-8 h-8 rounded-field bg-warm-island flex items-center justify-center">
                        <Icon size={15} strokeWidth={1.5} className="text-ink-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink">{title}</p>
                        <p className="text-xs leading-body text-ink-muted mt-0.5">{desc}</p>
                      </div>
                      <Toggle
                        checked={prefs[key]}
                        onChange={() => togglePref(key)}
                        label={`Włącz: ${title}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Kanały */}
              <div className="mb-6">
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-4">
                  Sposób dostarczania
                </p>
                <div className="divide-y divide-border-warm">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="shrink-0 w-8 h-8 rounded-field bg-warm-island flex items-center justify-center">
                      <Mail size={15} strokeWidth={1.5} className="text-ink-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">E-mail</p>
                      <p className="text-xs text-ink-muted mt-0.5">anna.kowalska@gmail.com</p>
                    </div>
                    <Toggle
                      checked={prefs.channel_email}
                      onChange={() => togglePref("channel_email")}
                      label="Alerty e-mail"
                    />
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="shrink-0 w-8 h-8 rounded-field bg-warm-island flex items-center justify-center">
                      <Bell size={15} strokeWidth={1.5} className="text-ink-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">Powiadomienia push</p>
                      <p className="text-xs text-ink-muted mt-0.5">Wkrótce dostępne</p>
                    </div>
                    <Toggle
                      checked={prefs.channel_push}
                      onChange={() => togglePref("channel_push")}
                      label="Alerty push"
                    />
                  </div>
                </div>
              </div>

              {/* Zapis */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-7 py-3 text-sm font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
                >
                  {saved ? (
                    <>
                      <Check size={14} />
                      Zapisano
                    </>
                  ) : (
                    "Zapisz ustawienia"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"
                >
                  Zamknij
                </button>
              </div>
            </div>
          )}

          {/* Lista alertów */}
          {hasActive ? (
            <div className="space-y-4">
              {MOCK_ACTIVE_ALERTS.map((alert) => (
                <ActiveAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="bg-tech-island rounded-card p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-warm-island flex items-center justify-center mx-auto mb-4">
                <Bell size={20} strokeWidth={1.5} className="text-ink-subtle" />
              </div>
              <p className="text-sm leading-body text-ink-muted mb-1">
                Pupil jest zadbany — brak aktywnych alertów.
              </p>
              <p className="text-xs text-ink-subtle">
                Powiadomimy Cię, gdy coś będzie wymagało uwagi.
              </p>
            </div>
          )}
        </section>

        {/* Jak działają alerty */}
        <section className="mb-14 bg-tech-island rounded-card p-7 md:p-8">
          <h2 className="font-serif font-normal text-xl text-ink mb-5">
            Jak działają alerty
          </h2>
          <div className="space-y-5">
            {[
              {
                Icon: Clock,
                title: "Koniec suplementu",
                desc: "Na podstawie daty zakupu i zalecanej dawki — informujemy Cię z wyprzedzeniem 5 dni.",
              },
              {
                Icon: Leaf,
                title: "Nowy etap życia",
                desc: "Każdy pupil przechodzi przez etapy: szczenię, dorosły, senior. W każdym z nich zmienia się dieta i suplementacja.",
              },
              {
                Icon: AlertTriangle,
                title: "Ryzyko zdrowotne rasy",
                desc: "Np. koty kastrowane są podatne na otyłość. Golden retrievery — na dysplazję stawów po 5. roku życia.",
              },
              {
                Icon: Sparkles,
                title: "Lepszy produkt w asortymencie",
                desc: "Gdy pojawi się produkt lepiej dopasowany do aktualnego profilu zdrowotnego niż ten, który teraz stosujesz.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-field bg-warm-island flex items-center justify-center mt-0.5">
                  <Icon size={15} strokeWidth={1.5} className="text-ink-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink mb-0.5">{title}</p>
                  <p className="text-sm leading-body text-ink-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 pt-6 border-t border-border-warm flex items-start gap-2.5">
            <ShieldCheck size={13} strokeWidth={1.5} className="text-moss shrink-0 mt-0.5" />
            <p className="text-xs leading-body text-ink-subtle">
              Alerty mają charakter informacyjny i nie zastępują konsultacji
              z weterynarzem.
            </p>
          </div>
        </section>

        {/* Historia */}
        {MOCK_PAST_ALERTS.length > 0 && (
          <section>
            <h2 className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-5">
              Historia
            </h2>
            <div className="bg-card-warm rounded-card shadow-warm px-6 py-2">
              {MOCK_PAST_ALERTS.map((alert) => (
                <PastAlertRow key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
