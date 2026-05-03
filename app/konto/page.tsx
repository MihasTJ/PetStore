import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  Package,
  FileText,
  Settings,
  ChevronRight,
  ShieldCheck,
  Clock,
  Leaf,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPetProfile } from "@/lib/supabase/queries/pet-profiles";
import { getActiveAlerts } from "@/lib/supabase/queries/ai-alerts";
import { getLatestHealthReport } from "@/lib/supabase/queries/health-reports";
import { LogoutButton } from "@/components/account/logout-button";
import { AlertDismissButton } from "@/components/account/alert-dismiss-button";
import { PetProfileEditor } from "@/components/account/pet-profile-editor";
import type { AiAlert, OrderWithItems } from "@/types/database";

export const metadata = {
  title: "Konto — Nobile",
  description: "Twoje konto, profil pupila i historia zdrowotna.",
};

async function getOrders(customerId: string): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(5);
  return (data ?? []) as OrderWithItems[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł";
}

const STATUS_LABELS: Record<string, string> = {
  pending:    "Oczekuje",
  paid:       "Opłacono",
  processing: "W realizacji",
  shipped:    "Wysłano",
  delivered:  "Dostarczono",
  cancelled:  "Anulowano",
  refunded:   "Zwrócono",
};

function AlertCard({ alert }: { alert: AiAlert }) {
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
        {alert.product_id && (
          <Link
            href={`/produkty`}
            className="inline-flex items-center gap-1 text-xs font-medium text-terracotta hover:text-terracotta-hover transition-colors"
          >
            Zobacz rekomendacje
            <ChevronRight size={12} />
          </Link>
        )}
      </div>

      <AlertDismissButton alertId={alert.id} />
    </div>
  );
}

export default async function KontoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/konto/logowanie");

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .single();

  const [pet, alerts, orders] = await Promise.all([
    getPetProfile(user.id),
    getActiveAlerts(user.id),
    getOrders(user.id),
  ]);

  const latestReport = pet ? await getLatestHealthReport(pet.id) : null;

  const memberSince = customer?.created_at
    ? new Date(customer.created_at).toLocaleDateString("pl-PL", {
        month: "long",
        year: "numeric",
      })
    : "";

  const firstName = customer?.first_name ?? user.email?.split("@")[0] ?? "Hej";
  const reportScore = latestReport
    ? (() => {
        const recs = latestReport.recommendations;
        if (!Array.isArray(recs) || recs.length === 0) return null;
        const scores = (recs as { matchScore?: number }[])
          .filter((r) => typeof r.matchScore === "number")
          .map((r) => r.matchScore as number);
        if (scores.length === 0) return null;
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      })()
    : null;

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-shell px-6 pt-28 pb-24 md:px-12 md:pt-36">

        {/* Nagłówek */}
        <div className="mb-14">
          <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
            Konto
          </p>
          <h1 className="font-serif font-normal text-4xl md:text-5xl text-ink leading-editorial mb-3">
            Witaj, {firstName}.
          </h1>
          {pet && memberSince && (
            <p className="text-base leading-body text-ink-muted">
              Razem dbamy o {pet.pet_name} od {memberSince}.
            </p>
          )}
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
                  {alerts.length > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-terracotta text-card-warm text-[10px] font-medium font-tnum">
                      {alerts.length}
                    </span>
                  )}
                </div>
                <Link
                  href="/konto/alerty"
                  className="text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Wszystkie alerty
                </Link>
              </div>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              ) : (
                <div className="bg-tech-island rounded-card p-6 text-center">
                  <p className="text-sm text-ink-muted">
                    Brak aktywnych alertów — wszystko gra.
                  </p>
                </div>
              )}
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
                {orders.map((order) => {
                  const itemNames = order.order_items.map(
                    (i) =>
                      (i.product_snapshot as { name?: string })?.name ??
                      "Produkt"
                  );
                  return (
                    <Link
                      key={order.id}
                      href={`/konto/zamowienia/${order.id}`}
                      className="group block bg-card-warm rounded-card shadow-warm hover:shadow-warm-md transition-shadow cursor-pointer p-6 md:p-7"
                    >
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                            Zamówienie
                          </p>
                          <p className="text-sm text-ink-muted">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="flex items-start gap-3 shrink-0">
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-moss">
                              <ShieldCheck size={11} strokeWidth={1.5} />
                              {STATUS_LABELS[order.status] ?? order.status}
                            </span>
                            <p className="mt-1.5 text-lg font-medium text-ink font-tnum">
                              {formatPrice(order.total_amount)}
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
                        {itemNames.map((name, i) => (
                          <p key={i} className="text-sm leading-body text-ink-muted">
                            {name}
                          </p>
                        ))}
                      </div>
                    </Link>
                  );
                })}

                {orders.length === 0 && (
                  <div className="bg-card-warm rounded-card p-8 text-center">
                    <p className="text-sm text-ink-muted mb-4">
                      {pet ? `${pet.pet_name} jeszcze na coś czeka.` : "Pupil jeszcze na coś czeka."}
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

              {latestReport ? (
                <div className="bg-tech-island rounded-card p-6 md:p-8">
                  <div className="flex items-start justify-between gap-6 mb-5">
                    <div>
                      <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-2">
                        Raport zdrowotny
                      </p>
                      <h3 className="font-serif font-normal text-xl text-ink mb-1">
                        Stan zdrowia na dziś
                      </h3>
                      <p className="text-sm text-ink-muted">
                        {formatDate(latestReport.created_at)}
                      </p>
                    </div>
                    {reportScore !== null && (
                      <div className="shrink-0 text-right">
                        <p className="text-3xl font-medium text-ink font-tnum leading-none">
                          {reportScore}
                          <span className="text-base text-ink-muted font-normal">%</span>
                        </p>
                        <p className="text-xs text-ink-subtle mt-1">dopasowania</p>
                      </div>
                    )}
                  </div>

                  {reportScore !== null && (
                    <div className="w-full h-1 rounded-full bg-border-warm overflow-hidden mb-5">
                      <div
                        className="h-full rounded-full bg-terracotta"
                        style={{ width: `${reportScore}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-5">
                    {latestReport.report_pdf_url && (
                      <a
                        href={latestReport.report_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta hover:text-terracotta-hover transition-colors"
                      >
                        Pobierz raport PDF
                        <ChevronRight size={12} />
                      </a>
                    )}
                    <Link
                      href="/quiz"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
                    >
                      Aktualizuj raport
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-tech-island rounded-card p-8 text-center">
                  <p className="text-sm text-ink-muted mb-4">
                    Brak raportu — wypełnij quiz zdrowotny.
                  </p>
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-hover transition-colors"
                  >
                    {pet
                      ? `Sprawdź, czego potrzebuje ${pet.pet_name}`
                      : "Sprawdź, czego potrzebuje Twój pupil"}
                    <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </section>

          </div>

          {/* ── Prawa kolumna (sidebar) ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Profil pupila */}
            <div className="bg-card-warm rounded-card shadow-warm p-7">
              {pet ? (
                <PetProfileEditor pet={pet} />
              ) : (
                <>
                  <h2 className="font-serif font-normal text-xl text-ink mb-4">
                    Profil pupila
                  </h2>
                  <p className="text-sm text-ink-muted mb-4">
                    Brak profilu pupila — dodaj go, żeby otrzymywać spersonalizowane alerty.
                  </p>
                  <Link
                    href="/quiz"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta/40 transition-colors"
                  >
                    Sprawdź, czego potrzebuje Twój pupil
                    <ChevronRight size={14} />
                  </Link>
                </>
              )}
            </div>

            {/* Dane konta */}
            <div className="bg-card-warm rounded-card shadow-warm p-7">
              <h2 className="font-serif font-normal text-xl text-ink mb-5">
                Dane konta
              </h2>

              <div className="mb-6">
                {(customer?.first_name || customer?.last_name) && (
                  <p className="text-sm font-medium text-ink">
                    {[customer.first_name, customer.last_name].filter(Boolean).join(" ")}
                  </p>
                )}
                <p className="text-sm text-ink-muted mt-0.5">{user.email}</p>
                {memberSince && (
                  <p className="text-xs text-ink-subtle mt-2">
                    Konto od {memberSince}
                  </p>
                )}
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

                <LogoutButton />
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
