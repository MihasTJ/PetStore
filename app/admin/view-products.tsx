import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductStatus } from "./types";
import { HealthTag, Icon, StatusPill, Toggle } from "./ui";
import { createProduct, getAdminProducts, updateProduct, getProductIngredients, addIngredient, updateIngredient, deleteIngredient, reorderIngredients, getProductChangelog, getLowestPrice30d, type ChangelogEntry } from "@/lib/actions/products";
import { getCategories, type CategoryRow } from "@/lib/actions/categories";
import { getProductEndorsement, saveProductEndorsement, getExperts, getProductCertificates, addProductCertificate, deleteProductCertificate, uploadCertificateFile } from "@/lib/actions/endorsements";
import type { ExpertRow } from "@/lib/actions/endorsements";

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60_000)
  const h    = Math.floor(diff / 3_600_000)
  const d    = Math.floor(diff / 86_400_000)
  if (min < 2)  return "Przed chwilą"
  if (min < 60) return `${min} min temu`
  if (h < 24)   return `${h} godz. temu`
  if (d === 1)  return "Wczoraj"
  if (d < 7)    return `${d} dni temu`
  return new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })
}

// ── DB row types (after migration, amount is present) ─────────────────────────
type DbIngredient = {
  id: string
  ingredient_name: string
  ingredient_description: string | null
  amount: string | null
  is_highlighted: boolean
  order_index: number
}
type IngDraft = { name: string; desc: string; amount: string; highlight: boolean }

type EndorsementState = {
  endorsementId?: string
  expertId: string
  quote: string
  validationDate?: string
}

type CertItem = {
  id: string
  certificate_name: string
  issuing_body: string | null
  valid_until: string | null
  file_url: string | null
}
type CertDraft = { name: string; issuing_body: string; valid_until: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toUiStatus(dbStatus: string): "Active" | "Draft" | "Out of stock" {
  const map: Record<string, "Active" | "Draft" | "Out of stock"> = {
    "active":   "Active",
    "draft":    "Draft",
    "archived": "Out of stock",
  }
  return map[dbStatus] ?? "Draft"
}

function toAdminProduct(p: Awaited<ReturnType<typeof getAdminProducts>>[number]): Product {
  return {
    id: p.id,
    name: p.name_seo,
    slug: p.slug,
    original: (p.name_original as string | null) ?? p.name_seo,
    supplier: "—",
    price: p.price_sell,
    price_promo: (p as { price_promo?: number | null }).price_promo ?? null,
    stock: p.stock,
    status: toUiStatus(p.status),
    is_premium_verified: p.is_premium_verified,
    vet: null,
    category: ((p.categories as { name: string } | null)?.name) ?? "—",
    category_id: (p as { category_id?: string | null }).category_id ?? null,
    species: ((p.species as string[]) ?? []).join(" / ") || "—",
    health: (p.health_tags as string[]) ?? [],
    life_stage: (p.life_stage as string[]) ?? [],
    breed_tags: (p.breed_tags as string[]) ?? [],
    updated: new Date(p.updated_at).toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
    img: p.name_seo.slice(0, 9),
  };
}

const HEALTH_TAGS_LIST = [
  "Stawy", "Sierść", "Waga", "Zęby", "Serce", "Układ pokarmowy", "Wzrok",
] as const;

const SPECIES_LIST = ["Pies", "Kot"] as const;

const LIFE_STAGES_LIST = ["Szczenię", "Kocię", "Dorosły", "Senior"] as const;

// ── Ingredient inline form ────────────────────────────────────────────────────

function IngFormInline({ draft, onChange, onSave, onCancel, busy }: {
  draft: IngDraft
  onChange: (patch: Partial<IngDraft>) => void
  onSave: () => void
  onCancel: () => void
  busy: boolean
}) {
  return (
    <div
      style={{
        padding: "14px 16px", marginTop: 6,
        background: "var(--bg-card)", borderRadius: 12,
        border: "1px solid var(--primary)",
      }}
    >
      <div className="col" style={{ gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 10 }}>
          <div className="field">
            <div className="field-label">Nazwa składnika *</div>
            <input
              className="input"
              autoFocus
              value={draft.name}
              onChange={e => onChange({ name: e.target.value })}
              placeholder="np. Glukozamina HCl"
            />
          </div>
          <div className="field">
            <div className="field-label">Ilość</div>
            <input
              className="input"
              value={draft.amount}
              onChange={e => onChange({ amount: e.target.value })}
              placeholder="np. 500 mg"
            />
          </div>
        </div>
        <div className="field">
          <div className="field-label">Opis (tooltip dla klienta)</div>
          <input
            className="input"
            value={draft.desc}
            onChange={e => onChange({ desc: e.target.value })}
            placeholder="np. Wsparcie odbudowy chrząstki stawowej"
          />
        </div>
        <div className="row-between">
          <label className="row" style={{ gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={draft.highlight}
              onChange={e => onChange({ highlight: e.target.checked })}
            />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Wyróżniony składnik</span>
          </label>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-quiet btn-sm" onClick={onCancel}>Anuluj</button>
            <button
              className="btn btn-primary btn-sm"
              onClick={onSave}
              disabled={busy || !draft.name.trim()}
            >
              {busy ? "…" : "Zapisz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Products listing ──────────────────────────────────────────────────────────

export function ProductsView({ onOpenEditor, refreshKey }: { onOpenEditor: (p: Product) => void; refreshKey?: number }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showNewDrawer, setShowNewDrawer] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminProducts()
      .then((rows) => setLocalProducts(rows.map(toAdminProduct)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = useMemo(
    () =>
      localProducts.filter((p) => {
        if (filter === "active"   && p.status !== "Active")       return false;
        if (filter === "draft"    && p.status !== "Draft")        return false;
        if (filter === "out"      && p.status !== "Out of stock") return false;
        if (filter === "verified" && !p.is_premium_verified)      return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [filter, search, localProducts]
  );

  function handleProductCreated() {
    setShowNewDrawer(false);
    setLoading(true);
    getAdminProducts()
      .then((rows) => setLocalProducts(rows.map(toAdminProduct)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  return (
    <>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Produkty · {localProducts.length} pozycji</div>
            <h1 className="page-title">Katalog premium</h1>
            <p className="page-subtitle">
              Synchronizowane z Droplo i BaseLinker. Opisy SEO, certyfikaty i endorsementy
              weterynaryjne nigdy nie są nadpisywane przez import.
            </p>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost btn-sm">
              <Icon name="upload" size={14} /> Import CSV
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowNewDrawer(true)}
            >
              <Icon name="plus" size={14} /> Nowy produkt
            </button>
          </div>
        </div>

        <div className="row-between" style={{ marginBottom: 20 }}>
          <div className="segmented">
            <button className={filter === "all"      ? "active" : ""} onClick={() => setFilter("all")}>Wszystkie</button>
            <button className={filter === "active"   ? "active" : ""} onClick={() => setFilter("active")}>Aktywne</button>
            <button className={filter === "draft"    ? "active" : ""} onClick={() => setFilter("draft")}>Szkice</button>
            <button className={filter === "out"      ? "active" : ""} onClick={() => setFilter("out")}>Wyprzedane</button>
            <button className={filter === "verified" ? "active" : ""} onClick={() => setFilter("verified")}>Premium Verified</button>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <div className="topbar-search" style={{ width: 260, flex: "none" }}>
              <Icon name="search" size={14} />
              <input
                placeholder="Szukaj w katalogu…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-ghost btn-sm">
              <Icon name="filter" size={14} /> Filtry
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: "12px 8px" }}>
          {loading && (
            <div style={{ padding: "24px 0", textAlign: "center", fontSize: 13, color: "var(--text-tertiary)" }}>
              Ładowanie produktów…
            </div>
          )}
          <table className="table" style={{ display: loading ? "none" : undefined }}>
            <thead>
              <tr>
                <th style={{ width: 56 }}></th>
                <th>Produkt</th>
                <th>Kategoria</th>
                <th>Tagi zdrowotne</th>
                <th style={{ textAlign: "right" }}>Cena</th>
                <th style={{ textAlign: "right" }}>Stock</th>
                <th>Status</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => onOpenEditor(p)}>
                  <td>
                    <div
                      className="img-placeholder"
                      style={{ width: 48, height: 48, borderRadius: 12, fontSize: 8, lineHeight: 1.2, padding: 4 }}
                    >
                      {p.img.split("\n").map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, fontSize: 13.5 }}>{p.name}</span>
                      {p.is_premium_verified && (
                        <span className="tag tag-moss" title="Premium Verified">
                          <Icon name="shield" size={10} color="var(--secondary)" /> Verified
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
                      /{p.slug} · {p.supplier}
                    </div>
                  </td>
                  <td><span className="tag tag-quiet">{p.category}</span></td>
                  <td>
                    <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                      {p.health.slice(0, 2).map((h) => <HealthTag key={h} name={h} />)}
                      {p.health.length > 2 && (
                        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>+{p.health.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }} className="tabular">
                    {p.price_promo !== null ? (
                      <div>
                        <div style={{ color: "var(--primary)", fontWeight: 600 }}>{p.price_promo} PLN</div>
                        <div style={{ fontSize: 11, color: "var(--text-tertiary)", textDecoration: "line-through" }}>{p.price} PLN</div>
                      </div>
                    ) : (
                      `${p.price} PLN`
                    )}
                  </td>
                  <td style={{ textAlign: "right" }} className="tabular">
                    <span style={{
                      color: p.stock === 0 ? "var(--error)" : p.stock < 10 ? "var(--primary)" : "var(--text-primary)",
                      fontWeight: 500,
                    }}>
                      {p.stock}
                    </span>
                  </td>
                  <td><StatusPill status={p.status} /></td>
                  <td>
                    <button
                      className="btn btn-quiet"
                      style={{ padding: 6 }}
                      onClick={(e) => { e.stopPropagation(); onOpenEditor(p); }}
                    >
                      <Icon name="chevronRight" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "40px 0", textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>
                    Brak produktów spełniających kryteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNewDrawer && (
        <NewProductDrawer
          onClose={() => setShowNewDrawer(false)}
          onCreated={handleProductCreated}
        />
      )}
    </>
  );
}

// ── New Product Drawer ────────────────────────────────────────────────────────

type NewProductDrawerProps = { onClose: () => void; onCreated: () => void };

function NewProductDrawer({ onClose, onCreated }: NewProductDrawerProps) {
  const [name, setName]                   = useState("");
  const [slug, setSlug]                   = useState("");
  const [slugManual, setSlugManual]       = useState(false);
  const [priceOriginal, setPriceOriginal] = useState("");
  const [priceSell, setPriceSell]         = useState("");
  const [stock, setStock]                 = useState("0");
  const [descSeo, setDescSeo]             = useState("");
  const [species, setSpecies]             = useState<string[]>([]);
  const [healthTags, setHealthTags]       = useState<string[]>([]);
  const [lifeStage, setLifeStage]         = useState<string[]>([]);
  const [breedTags, setBreedTags]         = useState<string[]>([]);
  const [breedInput, setBreedInput]       = useState("");
  const [isPremiumVerified, setIsPremiumVerified] = useState(false);
  const [status, setStatus]               = useState<ProductStatus>("Draft");
  const [categoryId, setCategoryId]       = useState<string>("");
  const [categories, setCategories]       = useState<CategoryRow[]>([]);
  const [saving, setSaving]               = useState(false);
  const [errorMsg, setErrorMsg]           = useState("");

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  function handleNameChange(val: string) {
    setName(val);
    if (!slugManual) setSlug(toSlug(val));
  }

  function toggleSpecies(s: string) {
    setSpecies((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function toggleHealthTag(t: string) {
    setHealthTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  function toggleLifeStageDraft(s: string) {
    setLifeStage((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function addBreedDraft() {
    const val = breedInput.trim().replace(/,$/, "");
    if (val && !breedTags.includes(val)) setBreedTags((prev) => [...prev, val]);
    setBreedInput("");
  }

  async function handleSave() {
    if (!name.trim())   { setErrorMsg("Podaj nazwę produktu."); return; }
    if (!slug.trim())   { setErrorMsg("Slug URL nie może być pusty."); return; }
    if (!priceOriginal) { setErrorMsg("Podaj cenę hurtową."); return; }
    if (!priceSell)     { setErrorMsg("Podaj cenę sprzedaży."); return; }

    setSaving(true);
    setErrorMsg("");

    let result: { id: string } | { error: string };
    try {
      result = await createProduct({
        name_seo: name.trim(),
        slug: slug.trim(),
        price_original: parseFloat(priceOriginal),
        price_sell: parseFloat(priceSell),
        stock: parseInt(stock) || 0,
        description_seo: descSeo.trim() || undefined,
        species,
        health_tags: healthTags,
        life_stage: lifeStage,
        breed_tags: breedTags,
        is_premium_verified: isPremiumVerified,
        status,
        category_id: categoryId || null,
      });
    } catch {
      setSaving(false);
      setErrorMsg("Błąd serwera. Sprawdź logi konsoli i spróbuj ponownie.");
      return;
    }

    setSaving(false);
    if ("error" in result) { setErrorMsg(result.error); return; }
    onCreated();
  }

  const margin =
    priceOriginal && priceSell && parseFloat(priceOriginal) > 0 && parseFloat(priceSell) > 0
      ? Math.round((1 - parseFloat(priceOriginal) / parseFloat(priceSell)) * 100)
      : null;

  const canSave = name.trim() && slug.trim() && priceOriginal && priceSell;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer">
        <div style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--bg-canvas)", borderBottom: "1px solid var(--border)", padding: "20px 36px" }}>
          <div className="row-between">
            <div className="row" style={{ gap: 16 }}>
              <button className="topbar-icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
              <div>
                <div className="eyebrow">Nowy produkt</div>
                <div className="serif" style={{ fontSize: 22, marginTop: 4, color: name ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                  {name || "Wpisz nazwę produktu…"}
                </div>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-quiet btn-sm" onClick={onClose}>Anuluj</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !canSave}>
                {saving ? "Dodaję…" : "Dodaj produkt"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 36px 80px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
          <div className="col" style={{ gap: 20 }}>
            <div className="card">
              <div className="serif" style={{ fontSize: 18, marginBottom: 16 }}>Podstawowe dane</div>
              <div className="col" style={{ gap: 16 }}>
                <div className="field">
                  <div className="field-label">Nazwa editorial Premium <span style={{ color: "var(--error)" }}>*</span></div>
                  <input className="input" placeholder="np. Suplement na stawy z glukozaminą — senior" value={name} onChange={(e) => handleNameChange(e.target.value)} autoFocus />
                  <div className="field-help">Bez emoji, bez wykrzykników. Maks. ~70 znaków.</div>
                </div>
                <div className="field">
                  <div className="field-label">Slug URL <span style={{ color: "var(--error)" }}>*</span></div>
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ color: "var(--text-tertiary)", fontSize: 13, whiteSpace: "nowrap" }}>/produkty/</span>
                    <input className="input" style={{ flex: 1 }} value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} />
                    {slugManual && (
                      <button className="btn btn-quiet btn-sm" onClick={() => { setSlug(toSlug(name)); setSlugManual(false); }} title="Wygeneruj ponownie z nazwy">
                        <Icon name="refresh" size={12} /> Reset
                      </button>
                    )}
                  </div>
                  <div className="field-help">Automatycznie generowany z nazwy.</div>
                </div>
                <div className="field">
                  <div className="field-label">Opis SEO</div>
                  <textarea className="textarea" rows={3} placeholder="Skład zweryfikowany przez nasz Panel Kuratorów." value={descSeo} onChange={(e) => setDescSeo(e.target.value)} />
                  <div className="field-help">{descSeo.length} / 160 znaków</div>
                </div>
              </div>
            </div>

            <div className="card-island">
              <div className="serif" style={{ fontSize: 18, marginBottom: 16 }}>Klasyfikacja</div>
              <div className="col" style={{ gap: 18 }}>
                <div className="field">
                  <div className="field-label" style={{ marginBottom: 8 }}>Kategoria</div>
                  <select
                    className="input"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">— brak kategorii —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 8 }}>Gatunek</div>
                  <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                    {SPECIES_LIST.map((s) => (
                      <button key={s} className="btn btn-sm" onClick={() => toggleSpecies(s)} style={{ background: species.includes(s) ? "var(--primary-soft)" : "transparent", color: species.includes(s) ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${species.includes(s) ? "var(--primary)" : "var(--border)"}` }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 8 }}>Tagi zdrowotne</div>
                  <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                    {HEALTH_TAGS_LIST.map((t) => (
                      <button key={t} className="btn btn-sm" onClick={() => toggleHealthTag(t)} style={{ background: healthTags.includes(t) ? "var(--primary-soft)" : "transparent", color: healthTags.includes(t) ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${healthTags.includes(t) ? "var(--primary)" : "var(--border)"}` }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 8 }}>Etap życia</div>
                  <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                    {LIFE_STAGES_LIST.map((s) => (
                      <button key={s} className="btn btn-sm" onClick={() => toggleLifeStageDraft(s)} style={{ background: lifeStage.includes(s) ? "var(--primary-soft)" : "transparent", color: lifeStage.includes(s) ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${lifeStage.includes(s) ? "var(--primary)" : "var(--border)"}` }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 8 }}>Rasy <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>— opcjonalnie</span></div>
                  {breedTags.length > 0 && (
                    <div className="row" style={{ gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {breedTags.map((b) => (
                        <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "3px 8px", background: "var(--primary-soft)", borderRadius: 999, color: "var(--primary)" }}>
                          {b}
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }} onClick={() => setBreedTags((prev) => prev.filter((x) => x !== b))}>
                            <Icon name="x" size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    className="input"
                    placeholder="Np. Golden Retriever — Enter dodaje"
                    value={breedInput}
                    onChange={(e) => setBreedInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addBreedDraft(); } }}
                    onBlur={addBreedDraft}
                  />
                  <div className="field-help">Wpisz rasę i naciśnij Enter. <strong>Zostaw puste</strong> → produkt pojawia się przy wszystkich rasach (obroże, akcesoria, karmy ogólne itp.).</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col" style={{ gap: 20 }}>
            <div className="card-tight">
              <div className="eyebrow" style={{ marginBottom: 12 }}>Ceny i magazyn</div>
              <div className="col" style={{ gap: 14 }}>
                <div className="field">
                  <div className="field-label">Cena hurtowni <span style={{ color: "var(--error)" }}>*</span></div>
                  <div className="row" style={{ gap: 8 }}>
                    <input className="input tabular" type="number" min="0" step="0.01" placeholder="0.00" value={priceOriginal} onChange={(e) => setPriceOriginal(e.target.value)} />
                    <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>PLN</span>
                  </div>
                </div>
                <div className="field">
                  <div className="field-label">Cena dla klienta <span style={{ color: "var(--error)" }}>*</span></div>
                  <div className="row" style={{ gap: 8 }}>
                    <input className="input tabular" type="number" min="0" step="0.01" placeholder="0.00" value={priceSell} onChange={(e) => setPriceSell(e.target.value)} />
                    <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>PLN</span>
                  </div>
                  {margin !== null && (
                    <div className="field-help" style={{ color: margin < 0 ? "var(--error)" : margin < 20 ? "var(--primary)" : "var(--secondary)" }}>
                      Marża: {margin}%{margin < 0 ? " — cena poniżej kosztu!" : ""}
                    </div>
                  )}
                </div>
                <div className="field">
                  <div className="field-label">Stan magazynowy</div>
                  <input className="input tabular" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
                  {parseInt(stock) === 0 && <div className="field-help" style={{ color: "var(--error)" }}>Stock = 0 → produkt wyłączony z zakupu</div>}
                </div>
              </div>
            </div>

            <div className="card-tight">
              <div className="eyebrow" style={{ marginBottom: 12 }}>Publikacja</div>
              <div className="col" style={{ gap: 14 }}>
                <div className="field">
                  <div className="field-label" style={{ marginBottom: 6 }}>Status</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {(["Draft", "Active"] as ProductStatus[]).map((s) => (
                      <button key={s} onClick={() => setStatus(s)} className="btn btn-sm" style={{ background: status === s ? "var(--primary-soft)" : "transparent", color: status === s ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${status === s ? "var(--primary)" : "var(--border)"}`, padding: "8px 6px", fontSize: 11, justifyContent: "center" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="field-help">Draft — widoczny tylko w adminie. Active — widoczny w sklepie.</div>
                </div>
                <div className="row-between">
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--text-primary)" }}>Premium Verified</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 2 }}>Odznaka na miniaturce produktu</div>
                  </div>
                  <Toggle on={isPremiumVerified} onChange={setIsPremiumVerified} label="premium" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div style={{ padding: "12px 16px", background: "var(--error-soft)", border: "1px solid rgba(181,61,46,0.18)", borderRadius: 10, fontSize: 13, color: "var(--error)", lineHeight: 1.5 }}>
                {errorMsg}
              </div>
            )}

            <p style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.6 }}>
              Zdjęcia, mapa składu, endorsementy Kuratorów i certyfikaty dodasz po zapisaniu produktu w edytorze.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Product Editor ────────────────────────────────────────────────────────────

export function ProductEditor({ product, onClose, onSaved }: { product: Product; onClose: () => void; onSaved?: () => void }) {
  // Basic fields
  const [name, setName]               = useState(product.name);
  const [slug, setSlug]               = useState(product.slug);
  const [stock, setStock]             = useState(product.stock);
  const [priceSell, setPriceSell]     = useState(String(product.price));
  const [pricePromo, setPricePromo]   = useState(product.price_promo !== null ? String(product.price_promo) : "");
  const [lowestPrice30d, setLowestPrice30d] = useState<number | null>(null);
  const [status, setStatus]           = useState<ProductStatus>(product.status);
  const [seoTitle, setSeoTitle]       = useState(`${product.name} | Premium Pet Care`);
  const [seoDesc, setSeoDesc]         = useState("Skład zweryfikowany przez weterynarza. Bezpieczny dla ras predysponowanych do alergii. Darmowa dostawa od 199 PLN.");
  const [isPremiumVerified, setIsPremiumVerified] = useState(product.is_premium_verified);
  const [premiumNarrative, setPremiumNarrative]   = useState("Wyprodukowany w małej norweskiej manufakturze rodzinnej. Każda partia weryfikowana przez niezależne laboratorium.");
  const [categoryId, setCategoryId]   = useState<string>(product.category_id ?? "");
  const [categories, setCategories]   = useState<CategoryRow[]>([]);
  const [changelog, setChangelog]     = useState<ChangelogEntry[]>([]);
  const [saving, setSaving]           = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");

  // Tags
  const [healthTags, setHealthTags]   = useState<string[]>(product.health);
  const [speciesList, setSpeciesList] = useState<string[]>(
    product.species === "—" ? [] : product.species.split(" / ").filter(Boolean)
  );
  const [lifeStageList, setLifeStageList] = useState<string[]>(product.life_stage);
  const [breedTagsList, setBreedTagsList] = useState<string[]>(product.breed_tags);
  const [breedEditorInput, setBreedEditorInput] = useState("");

  // Ingredients
  const [ingredients, setIngredients] = useState<DbIngredient[]>([]);
  const [ingLoading, setIngLoading]   = useState(true);
  const [ingForm, setIngForm]         = useState<false | "new" | string>(false);
  const [ingDraft, setIngDraft]       = useState<IngDraft>({ name: "", desc: "", amount: "", highlight: false });
  const [ingBusy, setIngBusy]         = useState(false);

  // Endorsement
  const [endorsement, setEndorsement] = useState<EndorsementState | null>(null);
  const [endLoading, setEndLoading]   = useState(true);
  const [endSaving, setEndSaving]     = useState(false);
  const [endErr, setEndErr]           = useState("");
  const [experts, setExperts]         = useState<ExpertRow[]>([]);
  const [expertsLoading, setExpertsLoading] = useState(true);

  // Certificates
  const [certificates, setCertificates] = useState<CertItem[]>([]);
  const [certLoading, setCertLoading]   = useState(true);
  const [showCertForm, setShowCertForm] = useState(false);
  const [certDraft, setCertDraft]       = useState<CertDraft>({ name: "", issuing_body: "", valid_until: "" });
  const [certFile, setCertFile]         = useState<File | null>(null);
  const [certBusy, setCertBusy]         = useState(false);
  const [certErr, setCertErr]           = useState("");
  const certFileRef = useRef<HTMLInputElement>(null);

  // Load side-data on open
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getProductChangelog(product.id).then(setChangelog).catch(() => {});
    getLowestPrice30d(product.id).then((v) => {
      if (v !== null) setLowestPrice30d(v);
    }).catch(() => {});
  }, [product.id]);

  useEffect(() => {
    setIngLoading(true);
    getProductIngredients(product.id)
      .then((data) => setIngredients(data as DbIngredient[]))
      .finally(() => setIngLoading(false));

    setEndLoading(true);
    getProductEndorsement(product.id)
      .then((data) => {
        if (data) {
          setEndorsement({
            endorsementId: data.endorsementId,
            expertId: data.expertId,
            quote: data.quote,
            validationDate: data.validationDate ?? undefined,
          });
        }
      })
      .finally(() => setEndLoading(false));

    setExpertsLoading(true);
    getExperts().then(setExperts).finally(() => setExpertsLoading(false));

    setCertLoading(true);
    getProductCertificates(product.id)
      .then((data) => setCertificates(data as CertItem[]))
      .finally(() => setCertLoading(false));
  }, [product.id]);

  // ── Main save ──
  async function handleSave() {
    const promoVal = pricePromo.trim() ? parseFloat(pricePromo) : null;
    const sellVal  = parseFloat(priceSell) || product.price;
    if (promoVal !== null && promoVal >= sellVal) {
      setErrorMsg("Cena promocyjna musi być niższa od ceny regularnej.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    const result = await updateProduct(product.id, {
      name_seo: name.trim(),
      slug: slug.trim(),
      price_sell: sellVal,
      price_promo: promoVal,
      stock,
      status,
      is_premium_verified: isPremiumVerified,
      health_tags: healthTags,
      species: speciesList,
      life_stage: lifeStageList,
      breed_tags: breedTagsList,
      category_id: categoryId || null,
    });
    setSaving(false);
    if ("error" in result) { setErrorMsg(result.error); return; }
    getProductChangelog(product.id).then(setChangelog).catch(() => {});
    onSaved?.();
    onClose();
  }

  // ── Tag helpers ──
  function toggleHealthTag(t: string) {
    setHealthTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }
  function toggleSpecies(s: string) {
    setSpeciesList((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }
  function autoSuggestTags() {
    const n = name.toLowerCase();
    const suggestions: string[] = [];
    if (/staw|kolano|hip|ortoped/.test(n))           suggestions.push("Stawy");
    if (/sierść|futro|skór|włos|łupież/.test(n))     suggestions.push("Sierść");
    if (/serce|kardia|ciśnienie/.test(n))             suggestions.push("Serce");
    if (/waga|odchudzanie|metabol/.test(n))           suggestions.push("Waga");
    if (/ząb|zęby|jama ustna/.test(n))               suggestions.push("Zęby");
    if (/pokarm|trawien|żołąd|jelito/.test(n))        suggestions.push("Układ pokarmowy");
    if (/wzrok|oko|siatkówka/.test(n))               suggestions.push("Wzrok");
    setHealthTags((prev) => {
      const next = [...prev];
      for (const s of suggestions) if (!next.includes(s)) next.push(s);
      return next;
    });
  }

  function toggleLifeStage(s: string) {
    setLifeStageList((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }
  function addBreedEditor() {
    const val = breedEditorInput.trim().replace(/,$/, "");
    if (val && !breedTagsList.includes(val)) setBreedTagsList((prev) => [...prev, val]);
    setBreedEditorInput("");
  }

  // ── Ingredient helpers ──
  function openIngNew() {
    setIngDraft({ name: "", desc: "", amount: "", highlight: false });
    setIngForm("new");
  }
  function openIngEdit(ing: DbIngredient) {
    setIngDraft({ name: ing.ingredient_name, desc: ing.ingredient_description ?? "", amount: ing.amount ?? "", highlight: ing.is_highlighted });
    setIngForm(ing.id);
  }
  async function saveIng() {
    if (!ingDraft.name.trim()) return;
    setIngBusy(true);
    if (ingForm === "new") {
      await addIngredient(product.id, {
        ingredient_name: ingDraft.name.trim(),
        ingredient_description: ingDraft.desc.trim() || undefined,
        amount: ingDraft.amount.trim() || undefined,
        is_highlighted: ingDraft.highlight,
      });
    } else {
      await updateIngredient(ingForm as string, {
        ingredient_name: ingDraft.name.trim(),
        ingredient_description: ingDraft.desc.trim() || null,
        amount: ingDraft.amount.trim() || null,
        is_highlighted: ingDraft.highlight,
      });
    }
    const fresh = await getProductIngredients(product.id);
    setIngredients(fresh as DbIngredient[]);
    setIngForm(false);
    setIngBusy(false);
  }
  async function removeIng(id: string) {
    await deleteIngredient(id);
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }
  async function moveIng(index: number, dir: -1 | 1) {
    const next = [...ingredients];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setIngredients(next);
    await reorderIngredients(next.map((ing, i) => ({ id: ing.id, order_index: i })));
  }

  // ── Endorsement helpers ──
  async function handleSaveEndorsement() {
    if (!endorsement?.expertId) {
      setEndErr("Wybierz eksperta z listy.");
      return;
    }
    if (!endorsement?.quote.trim()) {
      setEndErr("Podaj cytat eksperta.");
      return;
    }
    setEndSaving(true);
    setEndErr("");
    const result = await saveProductEndorsement(product.id, {
      expertId: endorsement.expertId,
      quote: endorsement.quote,
      validationDate: endorsement.validationDate,
    });
    setEndSaving(false);
    if ("error" in result) { setEndErr(result.error); return; }
  }

  // ── Certificate helpers ──
  async function handleSaveCert() {
    if (!certDraft.name.trim()) { setCertErr("Podaj nazwę certyfikatu."); return; }
    setCertBusy(true);
    setCertErr("");
    let fileUrl: string | undefined;
    if (certFile) {
      const fd = new FormData();
      fd.append("file", certFile);
      fd.append("productId", product.id);
      const upResult = await uploadCertificateFile(fd);
      if ("error" in upResult) { setCertBusy(false); setCertErr(upResult.error); return; }
      fileUrl = upResult.url;
    }
    const result = await addProductCertificate(product.id, {
      certificate_name: certDraft.name.trim(),
      issuing_body: certDraft.issuing_body.trim() || undefined,
      valid_until: certDraft.valid_until || undefined,
      file_url: fileUrl,
    });
    setCertBusy(false);
    if ("error" in result) { setCertErr(result.error); return; }
    const fresh = await getProductCertificates(product.id);
    setCertificates(fresh as CertItem[]);
    setShowCertForm(false);
    setCertDraft({ name: "", issuing_body: "", valid_until: "" });
    setCertFile(null);
  }
  async function handleDeleteCert(id: string) {
    await deleteProductCertificate(id);
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  }

  const disabled = stock === 0;
  const isEdited = name !== product.name;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer">

        {/* Sticky header */}
        <div style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--bg-canvas)", borderBottom: "1px solid var(--border)", padding: "20px 36px" }}>
          <div className="row-between">
            <div className="row" style={{ gap: 16 }}>
              <button className="topbar-icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
              <div>
                <div className="eyebrow">Edytor produktu · {product.id}</div>
                <div className="row" style={{ gap: 10, marginTop: 4 }}>
                  <span className="serif" style={{ fontSize: 22 }}>{name}</span>
                  {isEdited && <span className="tag tag-rust">Niezapisane zmiany</span>}
                </div>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => window.open(`/products/${slug}${status !== "Active" ? "?preview=1" : ""}`, "_blank")}><Icon name="eye" size={14} /> Podgląd na sklepie</button>
              <button className="btn btn-quiet btn-sm" onClick={onClose}>Anuluj</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? "Zapisuję…" : "Zapisz zmiany"}
              </button>
            </div>
          </div>
        </div>

        {/* Out-of-stock banner */}
        {disabled && (
          <div style={{ margin: "20px 36px 0", padding: "16px 20px", background: "var(--error-soft)", border: "1px solid rgba(181,61,46,0.18)", borderRadius: "var(--radius-card-sm)", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ color: "var(--error)" }}><Icon name="alert" size={18} /></div>
            <div>
              <div style={{ fontWeight: 500, color: "var(--error)", marginBottom: 2 }}>Wyłączony z zakupu</div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>Stock = 0 — produkt jest ukryty na listingu.</div>
            </div>
          </div>
        )}

        {/* Two-column body */}
        <div style={{ padding: "28px 36px 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 28 }}>

          {/* ── Left column ── */}
          <div className="col" style={{ gap: 20 }}>

            {/* Tryb porównania */}
            <div className="card-quiet">
              <div className="row-between" style={{ marginBottom: 16 }}>
                <div>
                  <div className="eyebrow eyebrow-rust">Synchronizacja z hurtownią</div>
                  <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>Tryb porównania</div>
                </div>
                <span className="tag tag-quiet"><Icon name="link" size={10} /> {product.supplier} · {product.updated}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div className="field-label" style={{ marginBottom: 6 }}>Oryginalna nazwa (z hurtowni)</div>
                  <div className="input input-original">{product.original}</div>
                  <div className="field-help" style={{ marginTop: 6 }}>Zsynchronizowane automatycznie.</div>
                </div>
                <div className={isEdited ? "diff-edited" : ""}>
                  <div className="field-label" style={{ marginBottom: 6 }}>Nazwa Editorial Premium</div>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                  <div className="field-help" style={{ marginTop: 6 }}>Maks. ~70 znaków.</div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="card">
              <div className="serif" style={{ fontSize: 18, marginBottom: 16 }}>Identyfikacja i SEO</div>
              <div className="col" style={{ gap: 16 }}>
                <div className="field">
                  <div className="field-label">Slug URL</div>
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ color: "var(--text-tertiary)", fontSize: 13, whiteSpace: "nowrap" }}>premiumpet.pl/products/</span>
                    <input className="input" style={{ flex: 1 }} value={slug} onChange={(e) => setSlug(e.target.value)} />
                    <button className="btn btn-quiet btn-sm" onClick={() => setSlug(toSlug(name))}>
                      <Icon name="refresh" size={12} /> Auto z nazwy
                    </button>
                  </div>
                </div>
                <div className="field">
                  <div className="field-label">Meta title</div>
                  <input className="input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                  <div className="field-help">{seoTitle.length} / 60 znaków</div>
                </div>
                <div className="field">
                  <div className="field-label">Meta description</div>
                  <textarea className="textarea" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3} />
                  <div className="field-help">{seoDesc.length} / 160 znaków</div>
                </div>
              </div>
            </div>

            {/* Mapa składu */}
            <div className="card-island">
              <div className="row-between" style={{ marginBottom: 16 }}>
                <div>
                  <div className="eyebrow eyebrow-mossy">Mapa składu</div>
                  <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>Składniki i korzyści zdrowotne</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={openIngNew} disabled={ingForm === "new"}>
                  <Icon name="plus" size={14} /> Dodaj składnik
                </button>
              </div>

              {ingLoading ? (
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", textAlign: "center", padding: "16px 0" }}>Ładowanie składników…</div>
              ) : (
                <div className="col" style={{ gap: 8 }}>
                  {ingredients.map((ing, i) => (
                    <div key={ing.id}>
                      <div className="row" style={{ gap: 10, alignItems: "flex-start", padding: "12px 14px", background: "var(--bg-card)", borderRadius: 12, border: `1px solid ${ingForm === ing.id ? "var(--primary)" : "var(--border)"}` }}>
                        {/* Reorder */}
                        <div className="col" style={{ gap: 1, marginTop: 1 }}>
                          <button className="btn btn-quiet" style={{ padding: "2px 4px" }} onClick={() => moveIng(i, -1)} disabled={i === 0} title="Przesuń wyżej">
                            <Icon name="chevronUp" size={12} />
                          </button>
                          <button className="btn btn-quiet" style={{ padding: "2px 4px" }} onClick={() => moveIng(i, 1)} disabled={i === ingredients.length - 1} title="Przesuń niżej">
                            <Icon name="chevronDown" size={12} />
                          </button>
                        </div>
                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div className="row" style={{ gap: 8, marginBottom: ing.ingredient_description ? 4 : 0 }}>
                            <span style={{ fontWeight: 500, fontSize: 13.5 }}>{ing.ingredient_name}</span>
                            {ing.amount && <span className="tag tag-quiet tabular">{ing.amount}</span>}
                            {ing.is_highlighted && <span className="tag tag-moss"><Icon name="sparkle" size={9} /> Wyróżniony</span>}
                          </div>
                          {ing.ingredient_description && (
                            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{ing.ingredient_description}</div>
                          )}
                        </div>
                        {/* Actions */}
                        <button className="btn btn-quiet" style={{ padding: 6 }} onClick={() => ingForm === ing.id ? setIngForm(false) : openIngEdit(ing)} title="Edytuj">
                          <Icon name="edit" size={14} />
                        </button>
                        <button className="btn btn-quiet" style={{ padding: 6 }} onClick={() => removeIng(ing.id)} title="Usuń">
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                      {ingForm === ing.id && (
                        <IngFormInline draft={ingDraft} onChange={(p) => setIngDraft((prev) => ({ ...prev, ...p }))} onSave={saveIng} onCancel={() => setIngForm(false)} busy={ingBusy} />
                      )}
                    </div>
                  ))}

                  {ingForm === "new" && (
                    <IngFormInline draft={ingDraft} onChange={(p) => setIngDraft((prev) => ({ ...prev, ...p }))} onSave={saveIng} onCancel={() => setIngForm(false)} busy={ingBusy} />
                  )}

                  {ingredients.length === 0 && ingForm !== "new" && (
                    <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontStyle: "italic", textAlign: "center", padding: "8px 0" }}>
                      Brak składników. Kliknij „Dodaj składnik".
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-secondary)", fontStyle: "italic" }}>
                Każdy składnik widoczny na stronie produktu jako klikalny — tooltip z opisem buduje zaufanie i edukuje klienta.
              </div>
            </div>

            {/* Premium narrative */}
            <div className="card">
              <div className="row-between" style={{ marginBottom: 16 }}>
                <div>
                  <div className="eyebrow eyebrow-rust">Premium narrative</div>
                  <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>„Dlaczego to jest premium?"</div>
                </div>
              </div>
              <textarea className="textarea" rows={4} value={premiumNarrative} onChange={(e) => setPremiumNarrative(e.target.value)} />
              <div className="field-help" style={{ marginTop: 8 }}>Język korzyści, nie funkcji. Pojawia się w sekcji „Dlaczego Premium?" na karcie produktu.</div>
            </div>

            {/* Endorsement weterynaryjny */}
            <div className="card-tech">
              <div className="row-between" style={{ marginBottom: 16 }}>
                <div>
                  <div className="eyebrow eyebrow-mossy">Endorsement weterynaryjny</div>
                  <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>Rekomenduje ekspert</div>
                </div>
                <Toggle on={isPremiumVerified} onChange={setIsPremiumVerified} label="premium_verified" />
              </div>

              {(endLoading || expertsLoading) ? (
                <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Ładowanie…</div>
              ) : (
                <div className="col" style={{ gap: 14 }}>
                  {/* Expert picker */}
                  <div>
                    <div className="field-label" style={{ marginBottom: 8 }}>Wybierz eksperta</div>
                    {experts.filter(e => e.is_active).length === 0 ? (
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                        Brak aktywnych ekspertów. Dodaj eksperta w sekcji „Kuratorzy".
                      </div>
                    ) : (
                      <div className="col" style={{ gap: 6, maxHeight: 220, overflowY: "auto" }}>
                        {experts.filter(e => e.is_active).map(exp => {
                          const selected = endorsement?.expertId === exp.id;
                          return (
                            <div
                              key={exp.id}
                              onClick={() => setEndorsement(prev => prev
                                ? { ...prev, expertId: exp.id }
                                : { expertId: exp.id, quote: "" }
                              )}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`, background: selected ? "var(--primary-soft)" : "var(--bg-canvas)", cursor: "pointer", transition: "all 0.15s" }}
                            >
                              <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", background: "var(--bg-warm-island)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {exp.ai_generated_avatar_url
                                  ? <img src={exp.ai_generated_avatar_url} alt={exp.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  : <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-tertiary)" }}>{exp.name.charAt(0)}</span>
                                }
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: selected ? 600 : 500, color: selected ? "var(--primary)" : "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.name}</div>
                                <div style={{ fontSize: 11, color: "var(--text-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.role}</div>
                              </div>
                              {selected && <Icon name="shield" size={14} color="var(--primary)" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quote — visible only when an expert is selected */}
                  {endorsement && (
                    <>
                      <div className="field">
                        <div className="field-label">Cytat eksperta * (max 280 znaków)</div>
                        <textarea
                          className="textarea"
                          rows={3}
                          placeholder="Cytat widoczny na stronie produktu…"
                          value={endorsement.quote}
                          onChange={(e) => setEndorsement((prev) => prev ? { ...prev, quote: e.target.value } : prev)}
                        />
                        <div className="field-help">{endorsement.quote.length} / 280 znaków</div>
                      </div>

                      {endErr && (
                        <div style={{ padding: "8px 12px", background: "var(--error-soft)", borderRadius: 8, fontSize: 12, color: "var(--error)" }}>
                          {endErr}
                        </div>
                      )}

                      <div className="row" style={{ gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={handleSaveEndorsement} disabled={endSaving || !endorsement.expertId}>
                          {endSaving ? "Zapisuję…" : "Zapisz endorsement"}
                        </button>
                        <button className="btn btn-quiet btn-sm" onClick={() => { setEndorsement(null); setEndErr(""); }}>
                          Usuń
                        </button>
                      </div>
                    </>
                  )}

                  {!endorsement && experts.filter(e => e.is_active).length > 0 && (
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                      Kliknij eksperta powyżej, by przypisać endorsement do tego produktu.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* ── Right column ── */}
          <div className="col" style={{ gap: 20 }}>

            {/* Magazyn */}
            <div className="card-tight">
              <div className="eyebrow" style={{ marginBottom: 12 }}>Magazyn</div>
              <div className="col" style={{ gap: 14 }}>
                <div className="field">
                  <div className="field-label">Stock</div>
                  <input className="input tabular" type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value) || 0)} />
                  {stock === 0 && <div className="field-help" style={{ color: "var(--error)" }}>Stock = 0 → produkt automatycznie wyłączony</div>}
                  {stock > 0 && stock < 10 && <div className="field-help" style={{ color: "var(--primary)" }}>Niski stan — rozważ uzupełnienie</div>}
                </div>
                <div className="field">
                  <div className="field-label">Status publikacji</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                    {(["Active", "Draft", "Out of stock"] as ProductStatus[]).map((s) => (
                      <button key={s} onClick={() => setStatus(s)} className="btn btn-sm" style={{ background: status === s ? "var(--primary-soft)" : "transparent", color: status === s ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${status === s ? "var(--primary)" : "var(--border)"}`, padding: "8px 6px", fontSize: 11, justifyContent: "center" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <div className="field-label">Cena sprzedaży</div>
                  <div className="row" style={{ gap: 8 }}>
                    <input className="input tabular" type="number" min="0" step="0.01" value={priceSell} onChange={(e) => setPriceSell(e.target.value)} />
                    <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>PLN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cena promocyjna (Omnibus) */}
            <div className="card-tight" style={{ borderLeft: pricePromo ? "3px solid var(--primary)" : undefined }}>
              <div className="row-between" style={{ marginBottom: 12 }}>
                <div className="eyebrow eyebrow-rust">Cena promocyjna</div>
                {pricePromo && (
                  <button
                    className="btn btn-quiet btn-sm"
                    style={{ fontSize: 11, color: "var(--text-tertiary)" }}
                    onClick={() => setPricePromo("")}
                  >
                    <Icon name="x" size={11} /> Usuń promocję
                  </button>
                )}
              </div>
              <div className="col" style={{ gap: 12 }}>
                <div className="field">
                  <div className="field-label">Cena po obniżce</div>
                  <div className="row" style={{ gap: 8 }}>
                    <input
                      className="input tabular"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Zostaw puste = brak promocji"
                      value={pricePromo}
                      onChange={(e) => setPricePromo(e.target.value)}
                    />
                    <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>PLN</span>
                  </div>
                </div>

                {pricePromo && parseFloat(pricePromo) > 0 && parseFloat(priceSell) > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ padding: "10px 12px", background: "var(--primary-soft)", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Cena regularna</div>
                      <div className="tabular" style={{ fontSize: 15, fontWeight: 500, textDecoration: "line-through", color: "var(--text-secondary)" }}>
                        {parseFloat(priceSell).toFixed(2)} PLN
                      </div>
                    </div>
                    <div style={{ padding: "10px 12px", background: "var(--primary-soft)", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Oszczędność</div>
                      <div className="tabular" style={{ fontSize: 15, fontWeight: 600, color: "var(--primary)" }}>
                        -{Math.round((1 - parseFloat(pricePromo) / parseFloat(priceSell)) * 100)}%
                        <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 4 }}>
                          ({(parseFloat(priceSell) - parseFloat(pricePromo)).toFixed(2)} PLN)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ padding: "10px 12px", background: "rgba(61,79,61,0.06)", borderRadius: 8, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 500, color: "var(--secondary)", marginBottom: 2 }}>Dyrektywa Omnibus (automatycznie)</div>
                  {lowestPrice30d !== null ? (
                    <span>Najniższa cena z 30 dni: <strong>{lowestPrice30d.toFixed(2)} PLN</strong> — wyświetlana pod ceną na stronie produktu.</span>
                  ) : (
                    <span>Najniższa cena z 30 dni zostanie obliczona automatycznie i wyświetlona na stronie produktu.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Kategoria + tagi zdrowotne i gatunki */}
            <div className="card-tight">
              <div className="eyebrow" style={{ marginBottom: 12 }}>Klasyfikacja</div>
              <div className="col" style={{ gap: 14 }}>
                <div className="field">
                  <div className="field-label" style={{ marginBottom: 6 }}>Kategoria</div>
                  <select
                    className="input"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">— brak kategorii —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="row-between" style={{ marginBottom: 6 }}>
                    <div className="field-label">Tagi zdrowotne</div>
                    <button className="btn btn-quiet btn-sm" style={{ fontSize: 10, padding: "3px 8px" }} onClick={autoSuggestTags} title="Sugeruj tagi z nazwy produktu">
                      <Icon name="sparkle" size={10} /> Auto z nazwy
                    </button>
                  </div>
                  <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                    {HEALTH_TAGS_LIST.map((t) => (
                      <button key={t} className="btn btn-sm" onClick={() => toggleHealthTag(t)} style={{ background: healthTags.includes(t) ? "var(--primary-soft)" : "transparent", color: healthTags.includes(t) ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${healthTags.includes(t) ? "var(--primary)" : "var(--border)"}` }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 6 }}>Gatunek</div>
                  <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                    {SPECIES_LIST.map((s) => (
                      <button key={s} className="btn btn-sm" onClick={() => toggleSpecies(s)} style={{ background: speciesList.includes(s) ? "var(--primary-soft)" : "transparent", color: speciesList.includes(s) ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${speciesList.includes(s) ? "var(--primary)" : "var(--border)"}` }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 6 }}>Etap życia</div>
                  <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                    {LIFE_STAGES_LIST.map((s) => (
                      <button key={s} className="btn btn-sm" onClick={() => toggleLifeStage(s)} style={{ background: lifeStageList.includes(s) ? "var(--primary-soft)" : "transparent", color: lifeStageList.includes(s) ? "var(--primary)" : "var(--text-secondary)", border: `1px solid ${lifeStageList.includes(s) ? "var(--primary)" : "var(--border)"}` }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 6 }}>Rasy <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>— opcjonalnie</span></div>
                  {breedTagsList.length > 0 && (
                    <div className="row" style={{ gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {breedTagsList.map((b) => (
                        <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "3px 8px", background: "var(--primary-soft)", borderRadius: 999, color: "var(--primary)" }}>
                          {b}
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }} onClick={() => setBreedTagsList((prev) => prev.filter((x) => x !== b))}>
                            <Icon name="x" size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    className="input"
                    placeholder="Np. Golden Retriever — Enter dodaje"
                    value={breedEditorInput}
                    onChange={(e) => setBreedEditorInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addBreedEditor(); } }}
                    onBlur={addBreedEditor}
                  />
                  <div className="field-help">Wpisz rasę i naciśnij Enter. <strong>Zostaw puste</strong> → produkt pojawia się przy wszystkich rasach (obroże, akcesoria, karmy ogólne itp.).</div>
                </div>
              </div>
            </div>

            {/* Certyfikaty */}
            <div className="card-tight">
              <div className="row-between" style={{ marginBottom: 12 }}>
                <div className="eyebrow eyebrow-mossy">Certyfikaty</div>
                <Icon name="cert" size={16} color="var(--secondary)" />
              </div>

              {certLoading ? (
                <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Ładowanie…</div>
              ) : (
                <div className="col" style={{ gap: 8 }}>
                  {certificates.map((cert) => (
                    <div key={cert.id} style={{ padding: 12, background: "rgba(61,79,61,0.06)", border: "1px dashed rgba(61,79,61,0.25)", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <Icon name="fileText" size={16} color="var(--secondary)" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--secondary)" }}>{cert.certificate_name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
                          {cert.issuing_body ? `${cert.issuing_body} · ` : ""}
                          {cert.valid_until ? `ważny do ${cert.valid_until}` : "bez daty ważności"}
                        </div>
                        {cert.file_url && (
                          <a href={cert.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--primary)", marginTop: 2, display: "block" }}>
                            Pobierz PDF →
                          </a>
                        )}
                      </div>
                      <button className="btn btn-quiet" style={{ padding: 4 }} onClick={() => handleDeleteCert(cert.id)} title="Usuń certyfikat">
                        <Icon name="x" size={12} />
                      </button>
                    </div>
                  ))}

                  {/* New cert form */}
                  {showCertForm && (
                    <div style={{ padding: "14px 16px", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--primary)" }}>
                      <input ref={certFileRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) setCertFile(e.target.files[0]); }} />
                      <div className="col" style={{ gap: 10 }}>
                        <div className="field">
                          <div className="field-label">Nazwa certyfikatu *</div>
                          <input className="input" placeholder="np. VetSafe EU" value={certDraft.name} onChange={(e) => setCertDraft((p) => ({ ...p, name: e.target.value }))} autoFocus />
                        </div>
                        <div className="field">
                          <div className="field-label">Wystawca</div>
                          <input className="input" placeholder="np. European Pet Institute" value={certDraft.issuing_body} onChange={(e) => setCertDraft((p) => ({ ...p, issuing_body: e.target.value }))} />
                        </div>
                        <div className="field">
                          <div className="field-label">Ważny do</div>
                          <input className="input" type="date" value={certDraft.valid_until} onChange={(e) => setCertDraft((p) => ({ ...p, valid_until: e.target.value }))} />
                        </div>
                        <div>
                          <button className="btn btn-ghost btn-sm" onClick={() => certFileRef.current?.click()}>
                            <Icon name="upload" size={12} />
                            {certFile ? ` ${certFile.name}` : " Wybierz plik PDF"}
                          </button>
                        </div>
                        {certErr && <div style={{ fontSize: 12, color: "var(--error)" }}>{certErr}</div>}
                        <div className="row" style={{ gap: 8 }}>
                          <button className="btn btn-primary btn-sm" onClick={handleSaveCert} disabled={certBusy}>
                            {certBusy ? "Zapisuję…" : "Zapisz certyfikat"}
                          </button>
                          <button className="btn btn-quiet btn-sm" onClick={() => { setShowCertForm(false); setCertErr(""); }}>Anuluj</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!showCertForm && (
                    <button className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }} onClick={() => setShowCertForm(true)}>
                      <Icon name="upload" size={12} /> Wgraj certyfikat
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Błąd zapisu */}
            {errorMsg && (
              <div style={{ padding: "12px 16px", background: "var(--error-soft)", border: "1px solid rgba(181,61,46,0.18)", borderRadius: 10, fontSize: 13, color: "var(--error)", lineHeight: 1.5 }}>
                {errorMsg}
              </div>
            )}

            {/* Historia zmian */}
            <div className="card-tight">
              <div className="eyebrow" style={{ marginBottom: 12 }}>Historia zmian</div>
              <div className="col" style={{ gap: 12, fontSize: 12 }}>
                {changelog.length === 0 && (
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                    Brak zapisanych zmian. Historia pojawi się po pierwszym zapisaniu produktu.
                  </div>
                )}
                {changelog.map((e) => {
                  const isSync = e.source === "sync";
                  const initials = isSync ? "Sync" : e.changed_by.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={e.id} className="row" style={{ gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: isSync ? "var(--bg-warm-island)" : "var(--secondary-soft)", display: "grid", placeItems: "center", fontSize: 10, color: isSync ? "var(--text-tertiary)" : "var(--secondary)", flexShrink: 0, fontWeight: 500 }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "var(--text-primary)", lineHeight: 1.4 }}>{e.summary}</div>
                        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{relativeTime(e.created_at)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
