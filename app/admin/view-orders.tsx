"use client";

import { useEffect, useState } from "react";
import { Icon, PetAvatar, StatusPill } from "./ui";
import { getAdminOrders, getOrderDetail, initiatePayuRefund, syncPaidOrdersFromPayU, updateOrderStatus, type AdminOrder, type AdminOrderDetail, type AdminOrderStatus } from "@/lib/actions/orders";
import { OrderDrawer } from "./order-drawer";

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
  pending: "Oczekujące",
  paid: "Opłacone",
  processing: "W realizacji",
  shipped: "Wysłane",
  delivered: "Dostarczone",
  cancelled: "Anulowane",
  refunded: "Zwrot",
};

const SHIPPING_LABEL: Record<string, string> = {
  inpost: "InPost",
  dpd: "DPD",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersView() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refunding, setRefunding] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    const data = await getAdminOrders();
    setOrders(data);
    if (!silent) setLoading(false);
  }

  useEffect(() => {
    // Initial load + PayU sync
    syncPaidOrdersFromPayU().catch(() => {}).then(() => load());

    // Fast DB poll every 10s — picks up webhook-triggered changes near-instantly
    const fastTimer = setInterval(() => {
      getAdminOrders().then(setOrders).catch(() => {});
    }, 10_000);

    // Slow PayU sync every 60s — fallback when webhook was missed
    const syncTimer = setInterval(() => {
      syncPaidOrdersFromPayU().catch(() => {});
    }, 60_000);

    return () => {
      clearInterval(fastTimer);
      clearInterval(syncTimer);
    };
  }, []);

  async function handleRowClick(orderId: string) {
    setLoadingDetail(orderId);
    const detail = await getOrderDetail(orderId);
    setLoadingDetail(null);
    if (detail) setSelectedOrder(detail);
  }

  async function handleStatusChange(orderId: string, newStatus: AdminOrderStatus) {
    setUpdating(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.error) alert(`Błąd: ${result.error}`);
    else {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      setSelectedOrder((prev) => prev?.id === orderId ? { ...prev, status: newStatus } : prev);
    }
    setUpdating(null);
  }

  async function handleRefund(orderId: string, paymentId: string | null) {
    if (!paymentId) {
      alert("Brak ID transakcji PayU — nie można sprawdzić statusu zwrotu.");
      return;
    }
    if (!confirm("Sprawdzić status zwrotu w PayU i zsynchronizować?\n\nJeśli zwrot był już wykonany przez panel PayU — status zostanie zaktualizowany. Jeśli nie — zwrot zostanie zainicjowany przez API.")) return;
    setRefunding(orderId);
    const result = await initiatePayuRefund(orderId);
    setRefunding(null);
    if (result.error) {
      alert(`Błąd: ${result.error}`);
    } else {
      if (result.syncedFromPayu) {
        alert("Zsynchronizowano — zwrot był już zaksięgowany w PayU.");
      }
      setSelectedOrder(null);
      await load();
    }
  }

  const filtered = orders.filter((o) => filter === "all" || o.status === filter);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const totalToday = todayOrders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const premiumCount = orders.filter((o) => o.premiumPackaging).length;
  const premiumPct = orders.length > 0 ? Math.round((premiumCount / orders.length) * 100) : 0;
  const avgAmount = orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.totalAmount, 0) / orders.length) : 0;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Zamówienia · {loading ? "ładowanie…" : `${orders.length} łącznie`}</div>
          <h1 className="page-title">Transakcje</h1>
          <p className="page-subtitle">
            Webhooki PayU aktualizują status w czasie rzeczywistym. Każde zamówienie to moment dumy — preview raportu zdrowotnego dołączany automatycznie.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={14} /> Eksport</button>
          <button className="btn btn-primary btn-sm" onClick={() => load()} disabled={loading}>
            <Icon name="refresh" size={14} /> Odśwież
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <SummaryCard
          label="Dziś"
          value={`${totalToday.toLocaleString("pl-PL")} PLN`}
          sub={`${todayOrders.length} zamówień`}
        />
        <SummaryCard
          label="Oczekujące płatności"
          value={pendingCount}
          sub="status: pending"
          tone="warm"
        />
        <SummaryCard
          label="Średnia wartość"
          value={`${avgAmount} PLN`}
          sub={`${orders.length} zamówień łącznie`}
        />
        <SummaryCard
          label="Premium packaging"
          value={`${premiumPct}%`}
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
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary)" }}>
            Ładowanie zamówień…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary)" }}>
            Brak zamówień
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Zamówienie</th>
                <th>Klient</th>
                <th>Pupil</th>
                <th>Dostawa</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Kwota</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  style={{ cursor: loadingDetail === o.id ? "wait" : "pointer", opacity: loadingDetail === o.id ? 0.6 : 1 }}
                  onClick={() => handleRowClick(o.id)}
                >
                  <td>
                    <div style={{ fontWeight: 500, fontFamily: "monospace", fontSize: 12 }}>{o.shortId}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{formatDate(o.createdAt)} · {o.itemsCount} poz.</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{o.customerName}</div>
                    {o.customerEmail && <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{o.customerEmail}</div>}
                  </td>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <PetAvatar name={o.petName} size="sm" />
                      <span style={{ fontSize: 13 }}>{o.petName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                      <span className="tag tag-quiet">{SHIPPING_LABEL[o.shippingMethod] ?? o.shippingMethod}</span>
                      {o.paczkomatName && (
                        <span className="tag tag-quiet" style={{ fontFamily: "monospace", fontSize: 11 }} title={o.paczkomatName}>
                          {o.paczkomatName}
                        </span>
                      )}
                      {o.premiumPackaging && <span className="tag">Premium</span>}
                    </div>
                    {o.packagingNote && (
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontStyle: "italic", marginTop: 4, maxWidth: 200 }}>
                        „{o.packagingNote}"
                      </div>
                    )}
                  </td>
                  <td><StatusPill status={o.status} /></td>
                  <td style={{ textAlign: "right" }} className="tabular">
                    <span style={{ fontWeight: 500 }}>{o.totalAmount.toLocaleString("pl-PL")} PLN</span>
                  </td>
                  <td>
                    {o.status === "paid" && (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 11, padding: "2px 8px", color: "var(--text-tertiary)" }}
                        disabled={refunding === o.id}
                        onClick={(e) => { e.stopPropagation(); handleRefund(o.id, o.paymentId); }}
                        title="Synchronizuj z PayU lub zainicjuj zwrot przez API"
                      >
                        {refunding === o.id ? "…" : "Zwrot"}
                      </button>
                    )}
                    {o.status !== "paid" && (
                      <Icon name="chevronRight" size={16} color="var(--text-tertiary)" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefund={() => handleRefund(selectedOrder.id, selectedOrder.paymentId)}
          onStatusChange={(status) => handleStatusChange(selectedOrder.id, status)}
          refunding={refunding === selectedOrder.id}
          updating={updating === selectedOrder.id}
        />
      )}
    </div>
  );
}
