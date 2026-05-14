import { PRODUCTS } from "./data";
import type { ViewId } from "./types";
import { Icon, PetAvatar, Sparkline, StatusPill } from "./ui";
import type { DashboardStats, FunnelStage, RecentOrder } from "@/lib/actions/dashboard";

function FunnelChart({ stages }: { stages: FunnelStage[] | null }) {
  if (!stages) {
    return (
      <div className="col" style={{ gap: 8 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="row" style={{ gap: 16, alignItems: "center" }}>
            <div style={{ width: 160, height: 14, background: "var(--border)", borderRadius: 4 }} />
            <div style={{ flex: 1, height: 28, background: "var(--border)", borderRadius: 6, opacity: 0.5 }} />
            <div style={{ width: 60, height: 14, background: "var(--border)", borderRadius: 4 }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="col" style={{ gap: 8 }}>
      {stages.map((s, i) => (
        <div key={s.label} className="row" style={{ gap: 16, alignItems: "center" }}>
          <div style={{ width: 160, fontSize: 12.5, color: "var(--text-secondary)" }}>{s.label}</div>
          <div style={{ flex: 1, position: "relative", height: 28 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${Math.min(s.pct, 100)}%`,
                background:
                  i === stages.length - 1
                    ? "var(--primary)"
                    : `rgba(184,101,74,${0.15 + i * 0.03})`,
                borderRadius: 6,
              }}
            />
            <div
              className="tabular"
              style={{
                position: "absolute",
                left: 12,
                top: 0,
                height: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: 12,
                fontWeight: 500,
                color: i === stages.length - 1 ? "#FDFBF7" : "var(--text-primary)",
              }}
            >
              {s.value.toLocaleString("pl-PL")}
            </div>
          </div>
          <div className="tabular" style={{ width: 60, textAlign: "right", fontSize: 12, color: "var(--text-tertiary)" }}>
            {s.pct.toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}

function FootStat({ label, value, delta, deltaTone = "up" }: { label: string; value: string; delta: string; deltaTone?: "up" | "quiet" }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 4, letterSpacing: "-0.01em" }}>{value}</div>
      <div style={{ fontSize: 11, color: deltaTone === "up" ? "var(--secondary)" : "var(--text-tertiary)" }}>{delta}</div>
    </div>
  );
}

function TrustRow({ label, value, pct, mossy }: { label: string; value: string; pct: number; mossy?: boolean }) {
  return (
    <div>
      <div className="row-between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, color: "var(--text-primary)" }}>{label}</span>
        <span className="tabular" style={{ fontSize: 12, color: "var(--text-secondary)" }}>{value}</span>
      </div>
      <div style={{ height: 4, background: "rgba(61,79,61,0.12)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: mossy ? "var(--secondary)" : "var(--primary)", borderRadius: 999 }} />
      </div>
    </div>
  );
}

export function DashboardView({
  onNavigate,
  stats,
}: {
  onNavigate: (v: ViewId) => void;
  stats: DashboardStats | null;
}) {
  const salesData  = stats?.salesSparkline ?? [12, 18, 15, 22, 19, 28, 31, 26, 35, 33, 42, 38, 45, 51];
  const quizData   = stats?.quizSparkline  ?? [8, 12, 11, 15, 17, 19, 21, 24, 23, 26, 28, 27, 31, 33, 35];
  const petData    = stats?.petSparkline   ?? [180, 195, 210, 228, 245, 260, 278, 290, 310, 328, 350, 372, 388, 400, 412];
  const alertData  = stats?.alertsSparkline ?? [5, 8, 7, 12, 15, 18, 22, 28, 30, 35, 42, 48, 55, 68, 86];

  const quizPct   = stats?.quizConversionPct  ?? null;
  const quizDelta = stats?.quizConversionDelta ?? null;
  const sales7d   = stats?.sales7d             ?? null;
  const ordersCount = stats?.ordersCount7d     ?? null;
  const petTotal  = stats?.petProfilesTotal    ?? null;
  const petNew    = stats?.petProfilesNewThisWeek ?? null;
  const alertsSent = stats?.alertsSent         ?? null;
  const funnelStages = stats?.funnelStages ?? null;
  const avgOrderValue30d = stats?.avgOrderValue30d ?? null;
  const topPetSpecies = stats?.topPetSpecies ?? null;
  const topPetSpeciesPct = stats?.topPetSpeciesPct ?? null;

  const speciesLabel: Record<string, string> = { pies: "Pies", kot: "Kot", inny: "Inny" };

  const quizCompleted = funnelStages?.[2]?.value ?? null;
  const quizWithOrder = funnelStages?.[3]?.value ?? null;
  const quizToOrderPct =
    quizCompleted && quizWithOrder && quizCompleted > 0
      ? Math.round((quizWithOrder / quizCompleted) * 100)
      : null;

  const quizCompleted7d  = stats?.quizCompleted7d  ?? null;
  const quizWithOrder7d  = stats?.quizWithOrder7d  ?? null;

  const trustTotal             = stats?.trustProductsTotal      ?? null;
  const trustWithEndorsement   = stats?.trustWithEndorsement    ?? null;
  const trustWithActiveCert    = stats?.trustWithActiveCert     ?? null;
  const trustPremiumVerified   = stats?.trustPremiumVerified    ?? null;
  const trustCertsExpiringSoon = stats?.trustCertsExpiringSoon  ?? null;

  const fmt = (n: number) => n.toLocaleString("pl-PL");

  const trustPct = (count: number | null) =>
    count !== null && trustTotal ? Math.round((count / trustTotal) * 100) : 0;
  const trustVal = (count: number | null) =>
    count !== null && trustTotal !== null ? `${count} / ${trustTotal}` : "—";

  const subtitle = (() => {
    if (quizCompleted7d === null) return null;
    const who = quizCompleted7d === 1 ? "1 właściciel ukończył" : `${quizCompleted7d} właścicieli ukończyło`;
    let text = `W tym tygodniu ${who} quiz zdrowotny.`;
    if (quizWithOrder7d !== null) {
      text += ` ${quizWithOrder7d} z nich kupiło rekomendowany produkt`;
      if (quizDelta !== null && Math.abs(quizDelta) >= 0.5) {
        const dir = quizDelta >= 0 ? "więcej" : "mniej";
        text += ` — to o ${Math.abs(quizDelta).toFixed(1)} pp ${dir} niż w poprzednim tygodniu`;
      }
      text += ".";
    }
    return text;
  })();

  const recentOrders: RecentOrder[] = stats?.recentOrders ?? [];
  const lowStock = PRODUCTS.filter((p) => p.stock > 0 && p.stock < 15).slice(0, 4);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Dzień dobry · {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}</div>
          <h1 className="page-title">Spokój ducha,<br/>w liczbach.</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={14} /> Eksport</button>
          <button className="btn btn-primary btn-sm"><Icon name="refresh" size={14} /> Synchronizuj hurtownie</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Konwersja Quiz → Zakup</div>
          <div className="kpi-value tabular">
            {quizPct === null ? "—" : quizPct.toFixed(1)}
            <span style={{ fontSize: 22, color: "var(--text-tertiary)" }}>%</span>
          </div>
          <div className="kpi-meta">
            {quizDelta !== null ? (
              <span className={`kpi-delta ${quizDelta >= 0 ? "up" : ""}`}>
                {quizDelta >= 0 ? "↑" : "↓"} {Math.abs(quizDelta).toFixed(1)} pp
              </span>
            ) : (
              <span className="kpi-delta" style={{ color: "var(--text-tertiary)" }}>—</span>
            )}
            <span>vs. zeszły tydzień</span>
          </div>
          <Sparkline data={quizData} />
        </div>
        <div className="kpi">
          <div className="kpi-label">Sprzedaż (7 dni)</div>
          <div className="kpi-value tabular">
            {sales7d === null ? "—" : fmt(Math.round(sales7d))}
            <span style={{ fontSize: 16, color: "var(--text-tertiary)", marginLeft: 4 }}>PLN</span>
          </div>
          <div className="kpi-meta">
            <span className="kpi-delta up" />
            <span>{ordersCount === null ? "—" : ordersCount} zamówień</span>
          </div>
          <Sparkline data={salesData} />
        </div>
        <div className="kpi">
          <div className="kpi-label">Aktywne profile pupili</div>
          <div className="kpi-value tabular">{petTotal === null ? "—" : fmt(petTotal)}</div>
          <div className="kpi-meta">
            {petNew !== null && petNew > 0 ? (
              <span className="kpi-delta up">↑ {petNew}</span>
            ) : (
              <span className="kpi-delta" style={{ color: "var(--text-tertiary)" }}>—</span>
            )}
            <span>nowych w tym tygodniu</span>
          </div>
          <Sparkline data={petData} color="var(--secondary)" />
        </div>
        <div className="kpi">
          <div className="kpi-label">AI Alerty wysłane</div>
          <div className="kpi-value tabular">{alertsSent === null ? "—" : fmt(alertsSent)}</div>
          <div className="kpi-meta">
            <span style={{ color: "var(--text-tertiary)", fontSize: 11 }}>ostatnie 30 dni</span>
          </div>
          <Sparkline data={alertData} color="var(--secondary)" />
        </div>
      </div>

      {/* Funnel + Trust */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="row-between" style={{ marginBottom: 20 }}>
            <div>
              <div className="eyebrow eyebrow-rust">Lejek konwersji</div>
              <h2 className="section-title" style={{ marginTop: 6 }}>Od quizu AI do koszyka</h2>
            </div>
            <button className="btn btn-quiet btn-sm">
              Ostatnie 30 dni <Icon name="chevronDown" size={14} />
            </button>
          </div>

          <FunnelChart stages={funnelStages} />

          <div className="divider" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <FootStat
              label="Średni koszyk"
              value={avgOrderValue30d !== null ? `${Math.round(avgOrderValue30d).toLocaleString("pl-PL")} PLN` : "—"}
              delta="ostatnie 30 dni"
              deltaTone="quiet"
            />
            <FootStat
              label="Najczęstszy pupil"
              value={topPetSpecies ? speciesLabel[topPetSpecies] ?? topPetSpecies : "—"}
              delta={topPetSpeciesPct !== null && topPetSpecies ? `${topPetSpeciesPct}% profili` : "brak danych"}
              deltaTone="quiet"
            />
            <FootStat
              label="Konwersja Quiz → Zakup"
              value={quizToOrderPct !== null ? `${quizToOrderPct}%` : "—"}
              delta={quizCompleted !== null ? `z ${quizCompleted.toLocaleString("pl-PL")} quizów` : "ostatnie 30 dni"}
              deltaTone={quizToOrderPct !== null && quizToOrderPct > 20 ? "up" : "quiet"}
            />
          </div>
        </div>

        <div className="card-island">
          <div className="eyebrow eyebrow-mossy">Trust signals · aktualnie</div>
          <h2 className="section-title" style={{ marginTop: 6, marginBottom: 18 }}>
            Weryfikacje<br/>składu
          </h2>

          <div className="col" style={{ gap: 14 }}>
            <TrustRow label="Produkty z endorsementem" value={trustVal(trustWithEndorsement)} pct={trustPct(trustWithEndorsement)} />
            <TrustRow label="Aktualne certyfikaty"     value={trustVal(trustWithActiveCert)}   pct={trustPct(trustWithActiveCert)}   mossy />
            <TrustRow label="Premium Verified"         value={trustVal(trustPremiumVerified)}  pct={trustPct(trustPremiumVerified)}  mossy />
          </div>

          {trustCertsExpiringSoon !== null && trustCertsExpiringSoon.length > 0 && (
            <>
              <div className="divider" style={{ background: "rgba(61,79,61,0.16)" }} />
              <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(61,79,61,0.15)", display: "grid", placeItems: "center", color: "var(--secondary)", flexShrink: 0 }}>
                  <Icon name="alert" size={16} />
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                  <div style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: 2 }}>
                    {trustCertsExpiringSoon.length === 1
                      ? "1 certyfikat wygasa w ciągu 30 dni"
                      : `${trustCertsExpiringSoon.length} certyfikaty wygasają w ciągu 30 dni`}
                  </div>
                  <div style={{ color: "var(--text-secondary)" }}>
                    {trustCertsExpiringSoon.map((c) => c.productName).join(", ")}.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Orders + Low stock */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginTop: 20 }}>
        <div className="card">
          <div className="row-between" style={{ marginBottom: 16 }}>
            <h2 className="section-title">Ostatnie zamówienia</h2>
            <button className="btn btn-quiet btn-sm" onClick={() => onNavigate("orders")}>
              Wszystkie <Icon name="arrowRight" size={14} />
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Zamówienie</th>
                <th>Pupil</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Kwota</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--text-tertiary)", padding: "24px 0" }}>
                    Brak zamówień
                  </td>
                </tr>
              ) : recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      #{o.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                      {o.customerName} · {fmtDate(o.createdAt)}
                    </div>
                  </td>
                  <td>
                    {o.petName ? (
                      <div className="row" style={{ gap: 10 }}>
                        <PetAvatar name={o.petName} size="sm" />
                        <span>{o.petName}</span>
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-tertiary)" }}>—</span>
                    )}
                  </td>
                  <td><StatusPill status={o.status} /></td>
                  <td style={{ textAlign: "right" }} className="tabular">
                    {o.amount.toLocaleString("pl-PL")} PLN
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="row-between" style={{ marginBottom: 16 }}>
            <div>
              <div className="eyebrow eyebrow-rust">Wymaga uwagi</div>
              <h2 className="section-title" style={{ marginTop: 6 }}>Niski stan magazynowy</h2>
            </div>
            <button className="btn btn-quiet btn-sm" onClick={() => onNavigate("products")}>
              <Icon name="arrowRight" size={14} />
            </button>
          </div>
          <div className="col" style={{ gap: 14 }}>
            {lowStock.map((p) => (
              <div key={p.id} className="row" style={{ alignItems: "flex-start", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
                <div className="img-placeholder" style={{ width: 44, height: 44, borderRadius: 10, fontSize: 8, lineHeight: 1.2, padding: 4, flexShrink: 0 }}>
                  {p.img.split("\n").map((l, i) => <div key={i}>{l}</div>)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.3, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </div>
                  <div className="row" style={{ gap: 8, fontSize: 11, color: "var(--text-secondary)" }}>
                    <span className={`tabular ${p.stock < 5 ? "text-primary-color" : ""}`} style={{ fontWeight: 500 }}>{p.stock} szt.</span>
                    <span>·</span>
                    <span>{p.price} PLN</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
