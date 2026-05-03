import Link from "next/link";
import {
  Bell,
  Package,
  FileText,
  Settings,
  ChevronRight,
  ShieldCheck,
  Clock,
  Leaf,
  LogOut,
  Heart,
  X,
} from "lucide-react";

export const metadata = {
  title: "Konto — Nobile",
  description: "Twoje konto, profil pupila i historia zdrowotna.",
};

// Docelowo: Supabase Auth session + SELECT z customers, pet_profiles, orders, ai_alerts, health_reports
const MOCK_USER = {
  name: "Anna",
  lastName: "Kowalska",
  email: "anna.kowalska@gmail.com",
  memberSince: "marzec 2026",
};

const MOCK_PET = {
  name: "Zuzia",
  species: "Kotka",
  breed: "Mieszaniec",
  age: "3 lata",
  birthDate: "15 marca 2023",
  weight: "4,2 kg",
  castrated: true,
};

const MOCK_ALERTS = [
  {
    id: 1,
    urgency: "high" as const,
    message: "Kończy się suplement na stawy — zostało 5 dni.",
    actionLabel: "Zamów kolejną porcję",
    href: "/produkty",
  },
  {
    id: 2,
    urgency: "info" as const,
    message:
      "Czas na profilaktykę zębową — kotki po 3. roku życia są na nią szczególnie podatne.",
    actionLabel: "Zobacz rekomendacje",
    href: "/produkty",
  },
];

const MOCK_ORDERS = [
  {
    id: "NB-2847",
    date: "28 kwietnia 2026",
    statusLabel: "Dostarczono",
    total: "189,00 zł",
    items: ["Suplement na stawy Senior — 90 kapsułek"],
  },
  {
    id: "NB-2614",
    date: "2 marca 2026",
    statusLabel: "Dostarczono",
    total: "134,00 zł",
    items: ["Karma premium z łososiem — 2 kg", "Przysmaki dentystyczne — 150 g"],
  },
];

const MOCK_REPORTS = [
  {
    id: 1,
    date: "28 kwietnia 2026",
    score: 87,
    summary:
      "Dieta zbilansowana. Zalecana profilaktyka stawów od 4. roku życia — przy tej wadze to szczególnie istotne.",
  },
];

function AlertCard({ alert }: { alert: (typeof MOCK_ALERTS)[0] }) {
  const isUrgent = alert.urgency === "high";
  return (
    <div
      className={`flex items-start gap-4 p-5 rounded-card border ${
        isUrgent
          ? "bg-card-warm border-terracotta/25"
          : "bg-tech-island border-border-warm"
      }`}
    >
      <div
        className={`shrink-0 w-9 h-9 rounded-field flex items-center justify-center ${
          isUrgent ? "bg-terracotta/10" : "bg-warm-island"
        }`}
      >
        {isUrgent ? (
          <Clock size={16} className="text-terracotta" strokeWidth={1.5} />
        ) : (
          <Leaf size={16} className="text-moss" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm leading-body text-ink mb-2">{alert.message}</p>
        <Link
          href={alert.href}
          className="inline-flex items-center gap-1 text-xs font-medium text-terracotta hover:text-terracotta-hover transition-colors"
        >
          {alert.actionLabel}
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Docelowo: onClick → dismiss alert w ai_alerts (is_sent = true) */}
      <button
        type="button"
        aria-label="Zamknij alert"
        className="shrink-0 text-ink-subtle hover:text-ink transition-colors mt-0.5"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function KontoPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-shell px-6 pt-28 pb-24 md:px-12 md:pt-36">

        {/* Nagłówek */}
        <div className="mb-14">
          <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
            Konto
          </p>
          <h1 className="font-serif font-normal text-4xl md:text-5xl text-ink leading-editorial mb-3">
            Witaj, {MOCK_USER.name}.
          </h1>
          <p className="text-base leading-body text-ink-muted">
            Razem dbamy o {MOCK_PET.name} od {MOCK_USER.memberSince}.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── Lewa kolumna ── */}
          <div className="lg:col-span-7 space-y-10">

            {/* Alerty zdrowotne */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Bell size={14} strokeWidth={1.5} className="text-ink-subtle" />
                  <h2 className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                    Alerty zdrowotne
                  </h2>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-terracotta text-card-warm text-[10px] font-medium font-tnum">
                    {MOCK_ALERTS.length}
                  </span>
                </div>
                <Link
                  href="/konto/alerty"
                  className="text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Wszystkie alerty
                </Link>
              </div>
              <div className="space-y-3">
                {MOCK_ALERTS.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </section>

            {/* Historia zamówień */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Package size={14} strokeWidth={1.5} className="text-ink-subtle" />
                <h2 className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                  Historia zamówień
                </h2>
              </div>

              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <Link
                    key={order.id}
                    href={`/konto/zamowienia/${order.id}`}
                    className="group block bg-card-warm rounded-card shadow-warm hover:shadow-warm-md transition-shadow cursor-pointer p-6 md:p-7"
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                          Zamówienie {order.id}
                        </p>
                        <p className="text-sm text-ink-muted">{order.date}</p>
                      </div>
                      <div className="flex items-start gap-3 shrink-0">
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-moss">
                            <ShieldCheck size={11} strokeWidth={1.5} />
                            {order.statusLabel}
                          </span>
                          <p className="mt-1.5 text-lg font-medium text-ink font-tnum">
                            {order.total}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          strokeWidth={1.5}
                          className="text-ink-subtle mt-0.5 group-hover:text-ink group-hover:translate-x-0.5 transition-all shrink-0"
                        />
                      </div>
                    </div>

                    <div className="border-t border-border-warm pt-4 space-y-1.5">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm leading-body text-ink-muted">
                          {item}
                        </p>
                      ))}
                    </div>
                  </Link>
                ))}

                {MOCK_ORDERS.length === 0 && (
                  <div className="bg-card-warm rounded-card p-8 text-center">
                    <p className="text-sm text-ink-muted mb-4">
                      Brak zamówień — pupil jeszcze na coś czeka.
                    </p>
                    <Link
                      href="/produkty"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-hover transition-colors"
                    >
                      Przejdź do sklepu
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Raporty zdrowotne */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <FileText size={14} strokeWidth={1.5} className="text-ink-subtle" />
                <h2 className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                  Raporty zdrowotne
                </h2>
              </div>

              <div className="space-y-4">
                {MOCK_REPORTS.map((report) => (
                  <div
                    key={report.id}
                    className="bg-tech-island rounded-card p-6 md:p-8"
                  >
                    <div className="flex items-start justify-between gap-6 mb-5">
                      <div>
                        <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-2">
                          Raport zdrowotny
                        </p>
                        <h3 className="font-serif font-normal text-xl text-ink mb-1">
                          Stan zdrowia na dziś
                        </h3>
                        <p className="text-sm text-ink-muted">{report.date}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-3xl font-medium text-ink font-tnum leading-none">
                          {report.score}
                          <span className="text-base text-ink-muted font-normal">%</span>
                        </p>
                        <p className="text-xs text-ink-subtle mt-1">optymalnej diety</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 rounded-full bg-border-warm overflow-hidden mb-5">
                      <div
                        className="h-full rounded-full bg-terracotta"
                        style={{ width: `${report.score}%` }}
                      />
                    </div>

                    <p className="text-sm leading-body text-ink-muted mb-6">
                      {report.summary}
                    </p>

                    <div className="flex items-center gap-5">
                      <a
                        href="#"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta hover:text-terracotta-hover transition-colors"
                      >
                        Pobierz raport PDF
                        <ChevronRight size={12} />
                      </a>
                      <Link
                        href="/quiz"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
                      >
                        Aktualizuj raport
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}

                {MOCK_REPORTS.length === 0 && (
                  <div className="bg-tech-island rounded-card p-8 text-center">
                    <p className="text-sm text-ink-muted mb-4">
                      Brak raportu — wypełnij quiz zdrowotny.
                    </p>
                    <Link
                      href="/quiz"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-hover transition-colors"
                    >
                      Sprawdź, czego potrzebuje Twój pupil
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* ── Prawa kolumna (sidebar) ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Profil pupila */}
            <div className="bg-card-warm rounded-card shadow-warm p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif font-normal text-xl text-ink">
                  Profil pupila
                </h2>
                <button
                  type="button"
                  className="text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Edytuj
                </button>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-14 h-14 rounded-full bg-warm-island flex items-center justify-center shrink-0">
                  <Heart size={20} className="text-ink-subtle" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-base font-medium text-ink">{MOCK_PET.name}</p>
                  <p className="text-sm text-ink-muted">
                    {MOCK_PET.species} · {MOCK_PET.breed}
                  </p>
                </div>
              </div>

              {/* Dane */}
              <div className="space-y-0">
                {[
                  { label: "Wiek", value: MOCK_PET.age },
                  { label: "Data urodzenia", value: MOCK_PET.birthDate },
                  { label: "Waga", value: MOCK_PET.weight },
                  { label: "Kastracja", value: MOCK_PET.castrated ? "Tak" : "Nie" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-3 border-b border-border-warm last:border-0"
                  >
                    <span className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                      {row.label}
                    </span>
                    <span className="text-sm text-ink">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/quiz"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta/40 transition-colors"
                >
                  Sprawdź, czego potrzebuje Twój pupil
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Dane konta */}
            <div className="bg-card-warm rounded-card shadow-warm p-7">
              <h2 className="font-serif font-normal text-xl text-ink mb-5">
                Dane konta
              </h2>

              <div className="mb-6">
                <p className="text-sm font-medium text-ink">
                  {MOCK_USER.name} {MOCK_USER.lastName}
                </p>
                <p className="text-sm text-ink-muted mt-0.5">{MOCK_USER.email}</p>
                <p className="text-xs text-ink-subtle mt-2">
                  Konto od {MOCK_USER.memberSince}
                </p>
              </div>

              <div className="space-y-0">
                <Link
                  href="/konto/ustawienia"
                  className="flex items-center justify-between py-3 border-b border-border-warm text-sm text-ink-muted hover:text-ink transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Settings size={14} strokeWidth={1.5} />
                    Ustawienia konta
                  </span>
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>

                {/* Docelowo: Supabase Auth signOut */}
                <button
                  type="button"
                  className="flex items-center gap-2 py-3 text-sm text-ink-muted hover:text-ink transition-colors w-full text-left"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Wyloguj się
                </button>
              </div>
            </div>

            {/* Trust signal */}
            <div className="flex items-start gap-3 px-1">
              <ShieldCheck
                size={15}
                strokeWidth={1.5}
                className="text-moss shrink-0 mt-0.5"
              />
              <p className="text-xs leading-body text-ink-subtle">
                Twoje dane i profil zdrowotny pupila są szyfrowane. Nie udostępniamy ich
                firmom ubezpieczeniowym ani podmiotom zewnętrznym.
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
