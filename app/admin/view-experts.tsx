import { useEffect, useRef, useState } from "react"
import { Icon, Toggle } from "./ui"
import {
  getExperts, createExpert, updateExpert, deleteExpert, uploadExpertPhoto,
} from "@/lib/actions/endorsements"
import type { ExpertRow } from "@/lib/actions/endorsements"

type ExpertDraft = { name: string; role: string; description: string; tags: string }
const EMPTY_DRAFT: ExpertDraft = { name: "", role: "", description: "", tags: "" }

function ExpertCard({
  expert,
  onUpdated,
  onDeleted,
}: {
  expert: ExpertRow
  onUpdated: (e: ExpertRow) => void
  onDeleted: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ExpertDraft>({
    name: expert.name,
    role: expert.role,
    description: expert.description ?? "",
    tags: expert.specialization_tags.join(", "),
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoHover, setPhotoHover] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  async function handlePhotoUpload(file: File) {
    setPhotoUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("expertId", expert.id)
    const result = await uploadExpertPhoto(fd)
    setPhotoUploading(false)
    if ("url" in result) {
      const res = await updateExpert(expert.id, { ai_generated_avatar_url: result.url })
      if ("ok" in res) onUpdated({ ...expert, ai_generated_avatar_url: result.url })
    }
  }

  async function handleSave() {
    if (!draft.name.trim() || !draft.role.trim()) { setErr("Podaj imię i rolę."); return }
    setSaving(true)
    setErr("")
    const tags = draft.tags.split(",").map(t => t.trim()).filter(Boolean)
    const res = await updateExpert(expert.id, {
      name: draft.name.trim(),
      role: draft.role.trim(),
      description: draft.description.trim() || null,
      specialization_tags: tags,
    })
    setSaving(false)
    if ("error" in res) { setErr(res.error); return }
    onUpdated({ ...expert, name: draft.name.trim(), role: draft.role.trim(), description: draft.description.trim() || null, specialization_tags: tags })
    setEditing(false)
  }

  async function handleToggleActive() {
    const res = await updateExpert(expert.id, { is_active: !expert.is_active })
    if ("ok" in res) onUpdated({ ...expert, is_active: !expert.is_active })
  }

  async function handleDelete() {
    if (!confirm(`Usunąć eksperta ${expert.name}? Ta akcja jest nieodwracalna.`)) return
    const res = await deleteExpert(expert.id)
    if ("ok" in res) onDeleted(expert.id)
  }

  return (
    <div style={{ background: "var(--bg-card)", border: `1px solid ${expert.is_active ? "var(--border)" : "var(--border)"}`, borderRadius: 16, overflow: "hidden", opacity: expert.is_active ? 1 : 0.55, transition: "opacity 0.2s" }}>
      <div style={{ padding: "20px 24px" }}>
        <div className="row" style={{ gap: 16, alignItems: "flex-start" }}>

          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]) }} />
            <div
              style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", cursor: "pointer", background: "var(--bg-warm-island)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
              onClick={() => photoRef.current?.click()}
              onMouseEnter={() => setPhotoHover(true)}
              onMouseLeave={() => setPhotoHover(false)}
            >
              {expert.ai_generated_avatar_url ? (
                <img src={expert.ai_generated_avatar_url} alt={expert.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 24, fontWeight: 600, color: "var(--text-tertiary)" }}>{expert.name.charAt(0)}</span>
              )}
              {(photoHover || photoUploading) && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                  {photoUploading
                    ? <span style={{ color: "white", fontSize: 10 }}>…</span>
                    : <Icon name="upload" size={15} color="white" />}
                </div>
              )}
            </div>
            <div style={{ fontSize: 9, color: "var(--text-tertiary)", textAlign: "center", marginTop: 4 }}>Kliknij, by zmienić</div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15.5 }}>{expert.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>{expert.role}</div>
            {expert.description && (
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 6, lineHeight: 1.5 }}>{expert.description}</div>
            )}
            {expert.specialization_tags.length > 0 && (
              <div className="row" style={{ gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                {expert.specialization_tags.map(t => (
                  <span key={t} className="tag tag-quiet" style={{ fontSize: 10 }}>{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="col" style={{ gap: 6, flexShrink: 0, alignItems: "flex-end" }}>
            <Toggle on={expert.is_active} onChange={handleToggleActive} label={expert.is_active ? "Aktywny" : "Nieaktywny"} />
            <div className="row" style={{ gap: 4 }}>
              <button className="btn btn-quiet btn-sm" onClick={() => { setEditing(v => !v); setErr("") }} title="Edytuj">
                <Icon name="edit" size={13} />
              </button>
              <button className="btn btn-quiet btn-sm" onClick={handleDelete} style={{ color: "var(--error)" }} title="Usuń">
                <Icon name="x" size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "20px 24px", background: "var(--bg-canvas)" }}>
          <div className="col" style={{ gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <div className="field-label">Imię i nazwisko *</div>
                <input className="input" value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} autoFocus />
              </div>
              <div className="field">
                <div className="field-label">Rola / tytuł *</div>
                <input className="input" value={draft.role} onChange={e => setDraft(p => ({ ...p, role: e.target.value }))} placeholder="np. Główny Analityk Formuł" />
              </div>
            </div>
            <div className="field">
              <div className="field-label">Bio (opcjonalnie)</div>
              <textarea className="textarea" rows={2} value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))} placeholder="Krótkie zdanie widoczne na stronie produktu." />
            </div>
            <div className="field">
              <div className="field-label">Tagi specjalizacji (przecinkami)</div>
              <input className="input" value={draft.tags} onChange={e => setDraft(p => ({ ...p, tags: e.target.value }))} placeholder="np. Ortopedia, Żywienie kliniczne, Senior" />
            </div>
            {err && <div style={{ fontSize: 12, color: "var(--error)" }}>{err}</div>}
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? "Zapisuję…" : "Zapisz zmiany"}</button>
              <button className="btn btn-quiet btn-sm" onClick={() => setEditing(false)}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function ExpertsView() {
  const [experts, setExperts] = useState<ExpertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newDraft, setNewDraft] = useState<ExpertDraft>(EMPTY_DRAFT)
  const [newSaving, setNewSaving] = useState(false)
  const [newErr, setNewErr] = useState("")

  useEffect(() => {
    getExperts().then(setExperts).finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    if (!newDraft.name.trim() || !newDraft.role.trim()) { setNewErr("Podaj imię i rolę."); return }
    setNewSaving(true)
    setNewErr("")
    const tags = newDraft.tags.split(",").map(t => t.trim()).filter(Boolean)
    const res = await createExpert({
      name: newDraft.name.trim(),
      role: newDraft.role.trim(),
      description: newDraft.description.trim() || undefined,
      specialization_tags: tags,
    })
    setNewSaving(false)
    if ("error" in res) { setNewErr(res.error); return }
    const updated = await getExperts()
    setExperts(updated)
    setShowNew(false)
    setNewDraft(EMPTY_DRAFT)
  }

  const active = experts.filter(e => e.is_active).length
  const inactive = experts.filter(e => !e.is_active).length

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Operacje · {experts.length} ekspertów · {active} aktywnych</div>
          <h1 className="page-title">Panel Kuratorów</h1>
          <p className="page-subtitle">
            Zarządzaj ekspertami, którzy rekomendują produkty w sklepie.
            Każdy produkt może być powiązany z jednym kuratorem.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNew(v => !v)}>
          <Icon name="plus" size={14} /> Nowy ekspert
        </button>
      </div>

      {showNew && (
        <div className="card" style={{ marginBottom: 24, border: "1px solid var(--primary)" }}>
          <div className="serif" style={{ fontSize: 17, marginBottom: 16 }}>Dodaj nowego eksperta</div>
          <div className="col" style={{ gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <div className="field-label">Imię i nazwisko *</div>
                <input className="input" placeholder="np. dr Anna Kowalska" value={newDraft.name} onChange={e => setNewDraft(p => ({ ...p, name: e.target.value }))} autoFocus />
              </div>
              <div className="field">
                <div className="field-label">Rola / tytuł *</div>
                <input className="input" placeholder="np. Weterynarz, spec. żywienia" value={newDraft.role} onChange={e => setNewDraft(p => ({ ...p, role: e.target.value }))} />
              </div>
            </div>
            <div className="field">
              <div className="field-label">Bio (opcjonalnie)</div>
              <textarea className="textarea" rows={2} placeholder="Krótkie zdanie widoczne na stronie produktu." value={newDraft.description} onChange={e => setNewDraft(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="field">
              <div className="field-label">Tagi specjalizacji (przecinkami)</div>
              <input className="input" placeholder="np. Ortopedia, Żywienie kliniczne" value={newDraft.tags} onChange={e => setNewDraft(p => ({ ...p, tags: e.target.value }))} />
            </div>
            <div className="field-help">Zdjęcie możesz dodać po zapisaniu eksperta.</div>
            {newErr && <div style={{ fontSize: 12, color: "var(--error)" }}>{newErr}</div>}
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={newSaving}>{newSaving ? "Dodaję…" : "Dodaj eksperta"}</button>
              <button className="btn btn-quiet btn-sm" onClick={() => { setShowNew(false); setNewErr("") }}>Anuluj</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, fontSize: 13, color: "var(--text-tertiary)" }}>Ładowanie…</div>
      ) : experts.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <Icon name="shield" size={32} color="var(--text-tertiary)" />
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--text-secondary)" }}>Brak ekspertów w bazie.</div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>Dodaj pierwszego, by rekomendował produkty w sklepie.</div>
        </div>
      ) : (
        <div className="col" style={{ gap: 14 }}>
          {inactive > 0 && (
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", paddingLeft: 2 }}>
              {inactive} ekspert{inactive === 1 ? "" : "ów"} nieaktywnych — nie pojawią się jako opcja w edytorze produktu.
            </div>
          )}
          {experts.map(e => (
            <ExpertCard
              key={e.id}
              expert={e}
              onUpdated={updated => setExperts(prev => prev.map(x => x.id === updated.id ? updated : x))}
              onDeleted={id => setExperts(prev => prev.filter(x => x.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
