import { useMemo, useState } from "react";
import { ALERTS, ORDERS, PETS, PRODUCTS } from "./data";
import type { Product, ViewId } from "./types";
import { HealthTag, Icon, PetAvatar, Sparkline, StatusPill } from "./ui";

export function DashboardView({ onNavigate }: { onNavigate: (v: ViewId) => void }) {
  const recentOrders = ORDERS.slice(0, 5);
  const lowStock = PRODUCTS.filter((p) => p.stock > 0 && p.stock < 15).slice(0, 4);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Dzień dobry · Wtorek, 5 maja</div>
          <h1 className="page-title">Spokój ducha,<br/>w liczbach.</h1>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi"><div className="kpi-label">Konwersja Quiz → Zakup</div><div className="kpi-value tabular">28.4%</div><Sparkline data={[8, 12, 11, 15, 17, 19, 21, 24, 23, 26]} /></div>
        <div className="kpi"><div className="kpi-label">Sprzedaż (7 dni)</div><div className="kpi-value tabular">28 740 PLN</div><Sparkline data={[12, 18, 15, 22, 19, 28, 31, 26, 35]} /></div>
        <div className="kpi"><div className="kpi-label">Aktywne profile pupili</div><div className="kpi-value tabular">412</div></div>
        <div className="kpi"><div className="kpi-label">AI Alerty wysłane</div><div className="kpi-value tabular">86</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginTop: 20 }}>
        <div className="card">
          <div className="row-between" style={{ marginBottom: 16 }}>
            <h2 className="section-title">Ostatnie zamówienia</h2>
            <button className="btn btn-quiet btn-sm" onClick={() => onNavigate("orders")}>Wszystkie <Icon name="arrowRight" size={14}/></button>
          </div>
          <table className="table"><tbody>{recentOrders.map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td><StatusPill status={o.status}/></td></tr>)}</tbody></table>
        </div>
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: 12 }}>Niski stan magazynowy</h2>
          {lowStock.map((p) => <div key={p.id} style={{ marginBottom: 10 }}>{p.name} · {p.stock} szt.</div>)}
        </div>
      </div>
    </div>
  );
}

export function ProductsView({ onOpenEditor }: { onOpenEditor: (p: Product) => void }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        if (filter === "active" && p.status !== "Active") return false;
        if (filter === "draft" && p.status !== "Draft") return false;
        if (filter === "out" && p.status !== "Out of stock") return false;
        if (filter === "verified" && !p.is_premium_verified) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [filter, search]
  );

  return (
    <div className="page fade-in">
      <div className="page-header"><h1 className="page-title">Katalog premium</h1></div>
      <div className="row-between" style={{ marginBottom: 20 }}>
        <div className="segmented">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Wszystkie</button>
          <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Aktywne</button>
          <button className={filter === "draft" ? "active" : ""} onClick={() => setFilter("draft")}>Szkice</button>
          <button className={filter === "out" ? "active" : ""} onClick={() => setFilter("out")}>Wyprzedane</button>
          <button className={filter === "verified" ? "active" : ""} onClick={() => setFilter("verified")}>Premium Verified</button>
        </div>
        <div className="topbar-search" style={{ width: 260 }}><Icon name="search" size={14}/><input placeholder="Szukaj w katalogu…" value={search} onChange={(e) => setSearch(e.target.value)}/></div>
      </div>
      <div className="card" style={{ padding: "12px 8px" }}>
        <table className="table">
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => onOpenEditor(p)}>
                <td>{p.name}</td>
                <td><span className="tag tag-quiet">{p.category}</span></td>
                <td className="tabular">{p.price} PLN</td>
                <td><StatusPill status={p.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProductEditor({ product, onClose }: { product: Product; onClose: () => void }) {
  const [name, setName] = useState(product.name);
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="drawer">
        <div style={{ padding: "20px 36px" }}>
          <div className="row-between">
            <div className="row" style={{ gap: 16 }}>
              <button className="topbar-icon-btn" onClick={onClose}><Icon name="x" size={18}/></button>
              <div><div className="eyebrow">Edytor produktu · {product.id}</div><span className="serif" style={{ fontSize: 22 }}>{name}</span></div>
            </div>
            <button className="btn btn-primary btn-sm">Zapisz zmiany</button>
          </div>
        </div>
        <div style={{ padding: "28px 36px 80px" }}>
          <div className="field">
            <div className="field-label">Nazwa Editorial Premium</div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
        </div>
      </div>
    </>
  );
}

export function PetsView() {
  const [selected, setSelected] = useState(PETS[1]);
  return (
    <div className="page fade-in">
      <div className="page-header"><h1 className="page-title">Pet Health<br/>Management</h1></div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 480px", gap: 24 }}>
        <div className="card" style={{ padding: "12px 8px" }}>
          <table className="table">
            <tbody>
              {PETS.map((p) => (
                <tr key={p.id} onClick={() => setSelected(p)}>
                  <td><PetAvatar name={p.name}/></td>
                  <td>{p.name}</td>
                  <td>{p.breed}</td>
                  <td>{p.weight} kg</td>
                  <td><div className="row" style={{ gap: 4 }}>{p.predispositions.slice(0, 1).map((tag) => <HealthTag key={tag} name={tag}/> )}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-tech"><div className="serif" style={{ fontSize: 32 }}>{selected.name}</div><div>{selected.owner}</div></div>
      </div>
    </div>
  );
}

export function OrdersView() {
  return (
    <div className="page fade-in">
      <div className="page-header"><h1 className="page-title">Transakcje</h1></div>
      <div className="card" style={{ padding: "12px 8px" }}>
        <table className="table"><tbody>{ORDERS.map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td>{o.pet}</td><td><StatusPill status={o.status}/></td><td>{o.amount} PLN</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

function AlertsPanel() {
  return <div className="card">{ALERTS.map((a) => <div key={a.id} style={{ marginBottom: 10 }}>{a.type} · {a.pet}</div>)}</div>;
}

export function IntelligenceView() {
  const [tab, setTab] = useState("quiz");
  return (
    <div className="page fade-in">
      <div className="page-header"><h1 className="page-title">Quiz, raporty,<br/>alerty prewencyjne</h1></div>
      <div className="segmented" style={{ marginBottom: 24 }}>
        <button className={tab === "quiz" ? "active" : ""} onClick={() => setTab("quiz")}>Quiz zdrowotny</button>
        <button className={tab === "alerts" ? "active" : ""} onClick={() => setTab("alerts")}>Reguły alertów</button>
      </div>
      {tab === "alerts" ? <AlertsPanel/> : <div className="card">Lejek pytań quizu</div>}
    </div>
  );
}

export function ContentView() {
  return <div className="page fade-in"><div className="page-header"><h1 className="page-title">Certyfikaty<br/>i głosy ekspertów</h1></div><div className="card">Treść trust signals</div></div>;
}
