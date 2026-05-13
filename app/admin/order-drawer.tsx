"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { AdminOrderDetail, AdminOrderStatus } from "@/lib/actions/orders";
import { Icon, PetAvatar, StatusPill } from "./ui";

const SHIPPING_LABEL: Record<string, string> = {
  inpost: "InPost",
  dpd: "DPD",
};

const STATUS_OPTIONS: { value: AdminOrderStatus; label: string }[] = [
  { value: "pending",    label: "Oczekujące" },
  { value: "paid",       label: "Opłacone" },
  { value: "processing", label: "W realizacji" },
  { value: "shipped",    label: "Wysłane" },
  { value: "delivered",  label: "Dostarczone" },
  { value: "cancelled",  label: "Anulowane" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmt(amount: number): string {
  return amount.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " PLN";
}

function DrawerRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="drawer-row">
      <span className="drawer-row-label">{label}</span>
      <span className="drawer-row-value">{children}</span>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="drawer-section">
      <div className="drawer-section-title">{title}</div>
      {children}
    </div>
  );
}

export function OrderDrawer({
  order,
  onClose,
  onRefund,
  onStatusChange,
  refunding,
  updating,
}: {
  order: AdminOrderDetail;
  onClose: () => void;
  onRefund: () => void;
  onStatusChange: (status: AdminOrderStatus) => void;
  refunding: boolean;
  updating: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const addr = order.shippingAddress;
  const shippingLabel = SHIPPING_LABEL[order.shippingMethod] ?? order.shippingMethod;
  const streetLine = addr.street ? addr.street + (addr.apt ? ` / ${addr.apt}` : "") : null;
  const cityLine = [addr.postal_code, addr.city].filter(Boolean).join(" ") || null;

  const content = (
    <div className="drawer-root">
      <div className="drawer-backdrop" onClick={onClose} />

      <div className="drawer" role="dialog" aria-modal="true" aria-label={`Zamówienie #${order.shortId}`}>

        {/* Header */}
        <div className="drawer-header">
          <div>
            <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 17, letterSpacing: "0.04em" }}>
              #{order.shortId}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>
              {formatDate(order.createdAt)}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {order.status === "refunded" ? (
              <StatusPill status="refunded" />
            ) : (
              <select
                className={`status-select ss-${order.status}`}
                value={order.status}
                disabled={updating}
                onChange={(e) => onStatusChange(e.target.value as AdminOrderStatus)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            <button className="btn btn-ghost btn-sm" onClick={onClose} title="Zamknij (Esc)" style={{ padding: 6 }}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="drawer-body">

          <DrawerSection title="Klient">
            <DrawerRow label="Imię i nazwisko">{order.customerName}</DrawerRow>
            {order.customerEmail && <DrawerRow label="Email">{order.customerEmail}</DrawerRow>}
            {order.nip && <DrawerRow label="NIP">{order.nip}</DrawerRow>}
          </DrawerSection>

          <DrawerSection title="Pupil">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <PetAvatar name={order.petName} size="sm" />
              <span style={{ fontWeight: 500, fontSize: 14 }}>{order.petName}</span>
            </div>
          </DrawerSection>

          <DrawerSection title="Produkty">
            {order.items.length === 0 ? (
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Brak pozycji</span>
            ) : (
              order.items.map((item) => (
                <div key={item.id} className="drawer-item-row">
                  {item.productSlug ? (
                    <a
                      href={`/products/${item.productSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "var(--primary)", textDecoration: "underline", textUnderlineOffset: 3 }}
                    >
                      {item.productName}
                    </a>
                  ) : (
                    <span style={{ fontSize: 13 }}>{item.productName}</span>
                  )}
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                    {item.quantity} × {fmt(item.priceAtPurchase)}
                  </span>
                </div>
              ))
            )}
          </DrawerSection>

          <DrawerSection title="Podsumowanie kosztów">
            <DrawerRow label={`Dostawa (${shippingLabel})`}>{fmt(order.shippingCost)}</DrawerRow>
            {order.premiumPackaging && <DrawerRow label="Premium packaging">19,00 PLN</DrawerRow>}
            <hr className="drawer-divider" />
            <DrawerRow label="Łącznie">
              <span style={{ fontWeight: 700, fontSize: 15 }}>{fmt(order.totalAmount)}</span>
            </DrawerRow>
          </DrawerSection>

          <DrawerSection title="Dostawa">
            <DrawerRow label="Metoda">{shippingLabel}</DrawerRow>
            {addr.point_name && (
              <DrawerRow label="Paczkomat">
                <span style={{ fontFamily: "monospace", fontSize: 12 }}>{addr.point_name}</span>
              </DrawerRow>
            )}
            {streetLine && <DrawerRow label="Ulica">{streetLine}</DrawerRow>}
            {cityLine && <DrawerRow label="Miasto">{cityLine}</DrawerRow>}
            {order.premiumPackaging && (
              <DrawerRow label="Premium packaging">
                <span style={{ color: "var(--primary)" }}>Tak</span>
              </DrawerRow>
            )}
            {order.packagingNote && (
              <DrawerRow label="Notatka">
                <em style={{ fontWeight: 400, color: "var(--text-secondary)" }}>„{order.packagingNote}"</em>
              </DrawerRow>
            )}
          </DrawerSection>

          <DrawerSection title="Płatność">
            <DrawerRow label="Status płatności"><StatusPill status={order.paymentStatus} /></DrawerRow>
            {order.paymentId && (
              <DrawerRow label="PayU ID">
                <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.03em" }}>{order.paymentId}</span>
              </DrawerRow>
            )}
          </DrawerSection>

        </div>

        {/* Footer */}
        {order.status === "paid" && (
          <div className="drawer-footer">
            <button className="btn btn-ghost btn-sm" disabled={refunding} onClick={onRefund}>
              {refunding ? "Przetwarzanie…" : "Zwrot PayU"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
