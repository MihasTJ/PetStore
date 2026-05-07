"use client";

import { useEffect, useState } from "react";
import "./styles.css";
import { ACCENTS, NAV } from "./data";
import type { Product, ViewId } from "./types";
import { Icon } from "./ui";
import { DashboardView } from "./view-dashboard";
import { ProductEditor, ProductsView } from "./view-products";
import { PetsView } from "./view-pets";
import { OrdersView } from "./view-orders";
import { IntelligenceView } from "./view-intelligence";
import { ContentView } from "./view-content";
import { ExpertsView } from "./view-experts";
import { CertificatesView } from "./view-certificates";

export default function AdminPage() {
  const [view, setView] = useState<ViewId>("dashboard");
  const [editing, setEditing] = useState<Product | null>(null);
  const [accent, setAccent] = useState<keyof typeof ACCENTS>("terracotta");
  const [showCount, setShowCount] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const a = ACCENTS[accent];
    const root = document.documentElement;
    root.style.setProperty("--primary", a.primary);
    root.style.setProperty("--primary-hover", a.primaryHover);
    root.style.setProperty("--primary-soft", a.primarySoft);
    root.style.setProperty("--primary-softer", a.primarySofter);
    root.style.setProperty("--shadow-sm", a.shadowSm);
  }, [accent]);

  const renderView = () => {
    switch (view) {
      case "dashboard":   return <DashboardView onNavigate={setView} />;
      case "products":    return <ProductsView onOpenEditor={setEditing} refreshKey={refreshKey} />;
      case "pets":        return <PetsView />;
      case "orders":      return <OrdersView />;
      case "intelligence":return <IntelligenceView />;
      case "content":     return <ContentView />;
      case "experts":       return <ExpertsView />;
      case "certificates":  return <CertificatesView />;
      default:            return <DashboardView onNavigate={setView} />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" />
          <span className="sidebar-brand-logo">Pupiel</span>
        </div>
        <div className="sidebar-section-label">Operacje</div>
        <nav className="sidebar-nav">
          {NAV.filter((n) => n.group === "main").map((n) => (
            <a
              key={n.id}
              className={`sidebar-link ${view === n.id ? "active" : ""}`}
              onClick={() => setView(n.id as ViewId)}
            >
              <Icon name={n.icon} size={16} color={view === n.id ? "var(--primary)" : "currentColor"} />
              <span>{n.label}</span>
              {n.count != null && showCount && (
                <span className="sidebar-link-count tabular">{n.count}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-section-label">Premium</div>
        <nav className="sidebar-nav">
          {NAV.filter((n) => n.group === "premium").map((n) => (
            <a
              key={n.id}
              className={`sidebar-link ${view === n.id ? "active" : ""}`}
              onClick={() => setView(n.id as ViewId)}
            >
              <Icon name={n.icon} size={16} color={view === n.id ? "var(--primary)" : "currentColor"} />
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-search">
            <Icon name="search" size={14} />
            <input placeholder="Szukaj produktów, zamówień, pupili…" />
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Powiadomienia">
              <Icon name="bell" size={18} /><span className="dot" />
            </button>
            <button className="topbar-icon-btn" title="Ustawienia">
              <Icon name="settings" size={18} />
            </button>
          </div>
        </div>
        {renderView()}
      </main>

      {editing && (
        <ProductEditor
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 12,
          zIndex: 100,
        }}
      >
        <div style={{ fontSize: 11, marginBottom: 8, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Tweaks
        </div>
        <div className="row" style={{ gap: 6, marginBottom: 8 }}>
          {(["terracotta", "rust", "amber", "moss"] as const).map((key) => (
            <button
              key={key}
              className={`btn btn-sm ${accent === key ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setAccent(key)}
            >
              {key}
            </button>
          ))}
        </div>
        <button
          className={`btn btn-sm ${showCount ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setShowCount((v) => !v)}
        >
          Liczniki
        </button>
      </div>
    </div>
  );
}
