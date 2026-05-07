import { useState } from "react";
import { ORDERS } from "./data";
import { Icon, PetAvatar, StatusPill } from "./ui";

function SummaryCard({ label, value, sub, tone }: { label: string; value: string | number; sub: string; tone?: "warm" | "moss" }) {
  const cls = tone === "moss" ? "card-tech" : tone === "warm" ? "card-island" : "card";
  return (
    <div className={cls} style={{ padding: 20 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      <div className="serif tabular" style={{ fontSize: 28, lineHeight: 1.05 }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  all: "Wszystkie",
  paid: "Opłacone",
  pending: "Oczekujące",
  shipped: "Wysłane",
  cancelled: "Anulowane",
};

export function OrdersView() {
  const [filter, setFilter] = useState("all");

  const filtered = ORDERS.filter((o) => filter === "all" || o.status.toLowerCase() === filter);

  const todayOrders  = ORDERS.filter((o) => o.date.startsWith("5 maj"));
  const totalToday   = todayOrders.reduce((s, o) => s + o.amount, 0);
  const pendingCount = ORDERS.filter((o) => o.status === "Pending").length;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Zamówienia · zaktualizowano teraz</div>
          <h1 className="page-title">Transakcje</h1>
          <p className="page-subtitle">
            Webhooki PayU aktualizują status w czasie rzeczywistym. Każde zamówienie to moment dumy — preview raportu zdrowotnego dołączany automatycznie.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={14} /> Eksport</button>
          <button className="btn btn-primary btn-sm"><Icon name="refresh" size={14} /> Odśwież PayU</button>
        </div>
      </div>

      {/* Mini summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <SummaryCard
          label="Dziś (5 maja)"
          value={`${totalToday.toLocaleString("pl-PL")} PLN`}
          sub={`${todayOrders.length} zamówień`}
        />
        <SummaryCard
          label="Oczekujące płatności"
          value={pendingCount}
          sub="BLIK · pending"
          tone="warm"
        />
        <SummaryCard
          label="Średnia wartość"
          value="287 PLN"
          sub="↑ 14 PLN vs. zeszły tydzień"
        />
        <SummaryCard
          label="Premium packaging"
          value="34%"
          sub="zamówień z opcją premium"
          tone="moss"
        />
      </div>

      <div className="row-between" style={{ marginBottom: 16 }}>
        <div className="segmented">
          {Object.keys(STATUS_LABELS).map((s) => (
            <button key={s} className={filter === s ? "active" : ""} onClick={() => setFilter(s)}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="filter" size={14} /> Filtry</button>
        </div>
      </div>

      <div className="card" style={{ padding: "12px 8px" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Zamówienie</th>
              <th>Klient</th>
              <th>Pupil</th>
              <th>Płatność</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Kwota</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ cursor: "pointer" }}>
                <td>
                  <div style={{ fontWeight: 500 }}>{o.id}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{o.date} · {o.items} pozycji</div>
                </td>
                <td>{o.customer}</td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <PetAvatar name={o.pet} size="sm" />
                    <span style={{ fontSize: 13 }}>{o.pet}</span>
                  </div>
                </td>
                <td><span className="tag tag-quiet">{o.method}</span></td>
                <td><StatusPill status={o.status} /></td>
                <td style={{ textAlign: "right" }} className="tabular">
                  <span style={{ fontWeight: 500 }}>{o.amount.toLocaleString("pl-PL")} PLN</span>
                </td>
                <td><Icon name="chevronRight" size={16} color="var(--text-tertiary)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
