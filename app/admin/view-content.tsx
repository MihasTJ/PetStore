"use client"

import { useState, useEffect } from "react"
import { Icon } from "./ui"
import { upsertSiteContent, getSiteContentByKeys } from "@/lib/actions/content"

// ─── CMS keys managed from this panel ────────────────────────────────────────

const CMS_FIELDS = [
  {
    key: "founder_letter_short",
    label: "List Założycielski — krótki",
    hint: "Wyświetlany na stronie głównej (po hero). 2–4 zdania, pierwsza osoba, bez języka sprzedażowego.",
    rows: 4,
    preview: "/",
  },
  {
    key: "founder_letter_full",
    label: "List Założycielski — pełny",
    hint: "Pełna historia na stronie /o-nas. Akapity oddziel pustą linią (Enter ↵ Enter ↵). Bez emoji, bez wykrzykników.",
    rows: 14,
    preview: "/o-nas",
  },
] as const

type CmsKey = (typeof CMS_FIELDS)[number]["key"]

// ─── Single editable field ────────────────────────────────────────────────────

function CmsField({
  field,
  value,
  onChange,
}: {
  field: (typeof CMS_FIELDS)[number]
  value: string
  onChange: (val: string) => void
}) {
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSave() {
    setSaving(true)
    setStatus("idle")
    const result = await upsertSiteContent(field.key, value)
    setSaving(false)
    if ("error" in result) {
      setStatus("error")
      setErrorMsg(result.error)
    } else {
      setStatus("saved")
      setTimeout(() => setStatus("idle"), 3500)
    }
  }

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Header row */}
      <div
        className="row-between"
        style={{ marginBottom: 8, alignItems: "flex-start", gap: 16 }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 13.5, color: "var(--text-primary)", marginBottom: 3 }}>
            {field.label}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
            {field.hint}
          </div>
        </div>
        <div className="row" style={{ gap: 8, flexShrink: 0 }}>
          <a
            href={field.preview}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            title={`Podgląd: ${field.preview}`}
          >
            <Icon name="search" size={13} /> Podgląd
          </a>
          <button
            className={`btn btn-sm ${saving ? "btn-ghost" : "btn-primary"}`}
            style={{ minWidth: 76 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Zapisuję…" : "Zapisz"}
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={field.rows}
        style={{
          width: "100%",
          background: "var(--bg-base)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 13.5,
          color: "var(--text-primary)",
          lineHeight: 1.65,
          resize: "vertical",
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)" }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
        placeholder={`[Uzupełnij: ${field.label}]`}
      />

      {/* Status messages */}
      {status === "saved" && (
        <p style={{ fontSize: 12, color: "var(--secondary)", marginTop: 5 }}>
          Zapisano. Zmiany widoczne po odświeżeniu strony.
        </p>
      )}
      {status === "error" && (
        <p style={{ fontSize: 12, color: "var(--error)", marginTop: 5 }}>
          Błąd zapisu: {errorMsg}
        </p>
      )}
    </div>
  )
}

// ─── Mocked certifications & experts (unchanged) ──────────────────────────────

const CERTS = [
  { name: "VetSafe EU 2026",               issuer: "VetSafe Certification Body",  products: 18, validUntil: "12.2027", expiringSoon: false },
  { name: "Norweska Hodowla Premium",       issuer: "Nordic Pet Council",          products: 12, validUntil: "06.2026", expiringSoon: true  },
  { name: "Skład Bezpieczny dla Alergików", issuer: "PolVet Lab",                  products: 24, validUntil: "09.2027", expiringSoon: false },
  { name: "Premium Verified",               issuer: "Wewnętrzna weryfikacja",      products: 89, validUntil: "—",       expiringSoon: false },
]

const EXPERTS_MOCK = [
  { name: "Wiktor",           title: "Główny Analityk Formuł Żywieniowych", endorsements: 14, since: "2026" },
  { name: "Julia",            title: "Kuratorka Wellness i Harmonii Ras",   endorsements: 9,  since: "2026" },
]

// ─── Main view ────────────────────────────────────────────────────────────────

export function ContentView() {
  const [values, setValues] = useState<Record<CmsKey, string>>({
    founder_letter_short: "",
    founder_letter_full: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSiteContentByKeys(["founder_letter_short", "founder_letter_full"]).then(
      (data) => {
        setValues({
          founder_letter_short: data["founder_letter_short"] ?? "",
          founder_letter_full: data["founder_letter_full"] ?? "",
        })
        setLoading(false)
      }
    )
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Treść · trust signals</div>
          <h1 className="page-title">
            Treść strony<br />i zaufanie
          </h1>
          <p className="page-subtitle">
            Anna sczyta autentyczność w 2 sekundy. List Założycielski to
            najsilniejszy element zaufania na starcie — edytuj go poniżej.
          </p>
        </div>
      </div>

      {/* ── CMS — List Założycielski ──────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="row-between" style={{ marginBottom: 20 }}>
          <div>
            <h2 className="section-title">List Założycielski</h2>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
              Klucze w tabeli <code style={{ fontFamily: "monospace", background: "var(--bg-tech)", padding: "1px 5px", borderRadius: 4 }}>site_content</code>
            </p>
          </div>
          <a href="/o-nas" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost btn-sm">
            <Icon name="search" size={13} /> /o-nas
          </a>
        </div>

        {loading ? (
          <div style={{ padding: "24px 0", color: "var(--text-tertiary)", fontSize: 13 }}>
            Ładowanie treści…
          </div>
        ) : (
          CMS_FIELDS.map((field) => (
            <CmsField
              key={field.key}
              field={field}
              value={values[field.key as CmsKey]}
              onChange={(val) =>
                setValues((prev) => ({ ...prev, [field.key]: val }))
              }
            />
          ))
        )}
      </div>

      {/* ── Certyfikaty + eksperci (dotychczasowe, mocked) ───────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>

        <div className="card">
          <div className="row-between" style={{ marginBottom: 18 }}>
            <h2 className="section-title">Certyfikaty</h2>
            <button className="btn btn-ghost btn-sm">
              <Icon name="upload" size={14} /> Nowy certyfikat
            </button>
          </div>
          <div className="col" style={{ gap: 12 }}>
            {CERTS.map((c) => (
              <div
                key={c.name}
                className="row"
                style={{ gap: 16, padding: 16, border: "1px solid var(--border)", borderRadius: 14, alignItems: "center" }}
              >
                <div
                  style={{
                    width: 48, height: 56,
                    background: c.expiringSoon ? "var(--error-soft)" : "rgba(61,79,61,0.08)",
                    borderRadius: 8,
                    display: "grid", placeItems: "center",
                    color: c.expiringSoon ? "var(--error)" : "var(--secondary)",
                  }}
                >
                  <Icon name="cert" size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</span>
                    {c.expiringSoon && <span className="tag tag-warn">Wygasa za 30 dni</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    {c.issuer} · ważny do {c.validUntil}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="tabular serif" style={{ fontSize: 22, color: "var(--text-primary)" }}>{c.products}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>produktów</div>
                </div>
                <button className="btn btn-quiet" style={{ padding: 6 }}>
                  <Icon name="edit" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card-island">
          <div className="row-between" style={{ marginBottom: 18 }}>
            <h2 className="section-title">Kuratorzy</h2>
            <button className="btn btn-quiet btn-sm"><Icon name="plus" size={12} /></button>
          </div>
          <div className="col" style={{ gap: 16 }}>
            {EXPERTS_MOCK.map((e) => (
              <div key={e.name} className="row" style={{ gap: 12, alignItems: "flex-start" }}>
                <div className="img-placeholder" style={{ width: 56, height: 56, borderRadius: "50%", fontSize: 9 }}>
                  {e.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13.5 }}>{e.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
                    {e.endorsements} endorsementów · od {e.since}
                  </div>
                </div>
              </div>
            ))}
            <a
              href="/eksperci"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--primary)", textDecoration: "none", marginTop: 4 }}
            >
              Zarządzaj na stronie /eksperci →
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
