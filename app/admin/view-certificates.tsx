import { useEffect, useRef, useState } from "react"
import { Icon } from "./ui"
import {
  getAllCertificates,
  addProductCertificate,
  deleteProductCertificate,
  uploadCertificateFile,
} from "@/lib/actions/endorsements"
import { getAdminProducts } from "@/lib/actions/products"

type CertRow = {
  id: string
  certificate_name: string
  issuing_body: string | null
  valid_until: string | null
  file_url: string | null
  product_id: string
  products: { name_seo: string; slug: string } | null
}

type ProductOption = { id: string; name: string }

type Draft = {
  productId: string
  name: string
  issuing_body: string
  valid_until: string
}

const EMPTY_DRAFT: Draft = { productId: "", name: "", issuing_body: "", valid_until: "" }

// ── Wiersz certyfikatu ────────────────────────────────────────────────────────

function CertRow({
  cert,
  onDeleted,
}: {
  cert: CertRow
  onDeleted: (id: string) => void
}) {
  async function handleDelete() {
    if (!confirm(`Usunąć certyfikat „${cert.certificate_name}"?`)) return
    await deleteProductCertificate(cert.id)
    onDeleted(cert.id)
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", background: "var(--bg-card)", borderRadius: 14, border: "1px solid var(--border)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(61,79,61,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px dashed rgba(61,79,61,0.2)" }}>
        <Icon name="cert" size={18} color="var(--secondary)" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{cert.certificate_name}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
          {cert.issuing_body && <span>{cert.issuing_body}</span>}
          {cert.issuing_body && cert.valid_until && <span> · </span>}
          {cert.valid_until && <span>ważny do {cert.valid_until}</span>}
          {!cert.issuing_body && !cert.valid_until && <span style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>Brak wystawcy i daty ważności</span>}
        </div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="tag tag-quiet" style={{ fontSize: 11 }}>
            <Icon name="products" size={9} />
            {" "}{cert.products?.name_seo ?? "—"}
          </span>
          {cert.file_url && (
            <a
              href={cert.file_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-quiet btn-sm"
              style={{ fontSize: 11, padding: "3px 8px", color: "var(--primary)" }}
            >
              <Icon name="download" size={11} /> PDF
            </a>
          )}
        </div>
      </div>

      <button
        className="btn btn-quiet"
        style={{ padding: 6, color: "var(--error)", flexShrink: 0 }}
        onClick={handleDelete}
        title="Usuń certyfikat"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  )
}

// ── Główny widok ──────────────────────────────────────────────────────────────

export function CertificatesView() {
  const [certs, setCerts] = useState<CertRow[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [certFile, setCertFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      getAllCertificates(),
      getAdminProducts(),
    ]).then(([c, p]) => {
      setCerts(c)
      setProducts(p.map(prod => ({ id: prod.id, name: prod.name_seo })))
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!draft.productId) { setErr("Wybierz produkt."); return }
    if (!draft.name.trim()) { setErr("Podaj nazwę certyfikatu."); return }
    setSaving(true)
    setErr("")

    let fileUrl: string | undefined
    if (certFile) {
      const fd = new FormData()
      fd.append("file", certFile)
      fd.append("productId", draft.productId)
      const upResult = await uploadCertificateFile(fd)
      if ("error" in upResult) { setSaving(false); setErr(upResult.error); return }
      fileUrl = upResult.url
    }

    const result = await addProductCertificate(draft.productId, {
      certificate_name: draft.name.trim(),
      issuing_body: draft.issuing_body.trim() || undefined,
      valid_until: draft.valid_until || undefined,
      file_url: fileUrl,
    })
    setSaving(false)
    if ("error" in result) { setErr(result.error); return }

    const fresh = await getAllCertificates()
    setCerts(fresh)
    setShowForm(false)
    setDraft(EMPTY_DRAFT)
    setCertFile(null)
  }

  const filtered = certs.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.certificate_name.toLowerCase().includes(q) ||
      c.products?.name_seo.toLowerCase().includes(q) ||
      c.issuing_body?.toLowerCase().includes(q)
    )
  })

  // Grupowanie po produkcie
  const grouped = filtered.reduce<Record<string, CertRow[]>>((acc, c) => {
    const key = c.product_id
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Operacje · {certs.length} certyfikatów</div>
          <h1 className="page-title">Rejestr certyfikatów</h1>
          <p className="page-subtitle">
            Wszystkie certyfikaty jakości przypisane do produktów.
            Certyfikaty dodane tu pojawiają się na stronach produktów w sklepie.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(v => !v); setErr("") }}>
          <Icon name="plus" size={14} /> Dodaj certyfikat
        </button>
      </div>

      {/* Formularz dodawania */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, border: "1px solid var(--primary)" }}>
          <div className="serif" style={{ fontSize: 17, marginBottom: 16 }}>Nowy certyfikat</div>
          <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) setCertFile(e.target.files[0]) }} />
          <div className="col" style={{ gap: 12 }}>
            <div className="field">
              <div className="field-label">Produkt *</div>
              <select
                className="input"
                value={draft.productId}
                onChange={e => setDraft(p => ({ ...p, productId: e.target.value }))}
                style={{ appearance: "auto" }}
              >
                <option value="">— Wybierz produkt —</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <div className="field-label">Nazwa certyfikatu *</div>
                <input className="input" placeholder="np. VetSafe EU, GMP+" value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} autoFocus />
              </div>
              <div className="field">
                <div className="field-label">Wystawca</div>
                <input className="input" placeholder="np. European Pet Institute" value={draft.issuing_body} onChange={e => setDraft(p => ({ ...p, issuing_body: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <div className="field-label">Ważny do</div>
                <input className="input" type="date" value={draft.valid_until} onChange={e => setDraft(p => ({ ...p, valid_until: e.target.value }))} />
              </div>
              <div className="field">
                <div className="field-label">Plik PDF (opcjonalnie)</div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: "100%", justifyContent: "flex-start" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Icon name="upload" size={12} />
                  {certFile ? ` ${certFile.name}` : " Wybierz plik PDF"}
                </button>
              </div>
            </div>
            {err && <div style={{ fontSize: 12, color: "var(--error)" }}>{err}</div>}
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? "Zapisuję…" : "Dodaj certyfikat"}</button>
              <button className="btn btn-quiet btn-sm" onClick={() => { setShowForm(false); setErr(""); setCertFile(null); setDraft(EMPTY_DRAFT) }}>Anuluj</button>
            </div>
          </div>
        </div>
      )}

      {/* Wyszukiwarka */}
      <div className="row-between" style={{ marginBottom: 20 }}>
        <div className="topbar-search" style={{ width: 320 }}>
          <Icon name="search" size={14} />
          <input
            placeholder="Szukaj certyfikatu, produktu, wystawcy…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
            {filtered.length} wyników
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, fontSize: 13, color: "var(--text-tertiary)" }}>Ładowanie…</div>
      ) : certs.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <Icon name="cert" size={32} color="var(--text-tertiary)" />
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--text-secondary)" }}>Brak certyfikatów w rejestrze.</div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>Dodaj pierwszy certyfikat, by wzmocnić zaufanie klientów.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 32, fontSize: 13, color: "var(--text-tertiary)" }}>
          Brak wyników dla „{search}".
        </div>
      ) : search ? (
        /* Widok płaski przy wyszukiwaniu */
        <div className="col" style={{ gap: 10 }}>
          {filtered.map(c => (
            <CertRow
              key={c.id}
              cert={c}
              onDeleted={id => setCerts(prev => prev.filter(x => x.id !== id))}
            />
          ))}
        </div>
      ) : (
        /* Widok pogrupowany po produktach */
        <div className="col" style={{ gap: 24 }}>
          {Object.entries(grouped).map(([productId, productCerts]) => {
            const productName = productCerts[0]?.products?.name_seo ?? "Produkt bez nazwy"
            const productSlug = productCerts[0]?.products?.slug
            return (
              <div key={productId}>
                <div className="row" style={{ gap: 8, marginBottom: 10, alignItems: "center" }}>
                  <div className="eyebrow eyebrow-mossy" style={{ flex: 1 }}>{productName}</div>
                  {productSlug && (
                    <a
                      href={`/products/${productSlug}?preview=1`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-quiet btn-sm"
                      style={{ fontSize: 11 }}
                    >
                      <Icon name="eye" size={11} /> Podgląd
                    </a>
                  )}
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{productCerts.length} cert.</span>
                </div>
                <div className="col" style={{ gap: 8 }}>
                  {productCerts.map(c => (
                    <CertRow
                      key={c.id}
                      cert={c}
                      onDeleted={id => setCerts(prev => prev.filter(x => x.id !== id))}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
