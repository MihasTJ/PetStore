import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui";
import { getCategories, createCategory, updateCategory, deleteCategory, type CategoryRow } from "@/lib/actions/categories";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type EditState = { id: string; name: string; slug: string; slugManual: boolean; busy: boolean; error: string };

export function CategoriesView() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  // New category form
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newSlugManual, setNewSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Inline edit state
  const [editing, setEditing] = useState<EditState | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);
  useEffect(() => { if (editing) editInputRef.current?.focus(); }, [editing?.id]);

  async function load() {
    setLoading(true);
    setCategories(await getCategories());
    setLoading(false);
  }

  function handleNewNameChange(val: string) {
    setNewName(val);
    if (!newSlugManual) setNewSlug(toSlug(val));
  }

  async function handleCreate() {
    if (!newName.trim()) { setErrorMsg("Podaj nazwę kategorii."); return; }
    setSaving(true);
    setErrorMsg("");
    const result = await createCategory(newName.trim(), newSlug.trim() || undefined);
    setSaving(false);
    if ("error" in result) { setErrorMsg(result.error); return; }
    setNewName(""); setNewSlug(""); setNewSlugManual(false); setShowForm(false);
    load();
  }

  function startEdit(cat: CategoryRow) {
    setEditing({ id: cat.id, name: cat.name, slug: cat.slug, slugManual: false, busy: false, error: "" });
  }

  function handleEditNameChange(val: string) {
    setEditing((prev) => prev ? { ...prev, name: val, slug: prev.slugManual ? prev.slug : toSlug(val) } : prev);
  }

  async function handleSaveEdit() {
    if (!editing || !editing.name.trim()) return;
    setEditing((prev) => prev ? { ...prev, busy: true, error: "" } : prev);
    const result = await updateCategory(editing.id, editing.name.trim(), editing.slug.trim() || undefined);
    if ("error" in result) {
      setEditing((prev) => prev ? { ...prev, busy: false, error: result.error } : prev);
      return;
    }
    setCategories((prev) => prev.map((c) =>
      c.id === editing.id ? { ...c, name: editing.name.trim(), slug: editing.slug.trim() || toSlug(editing.name) } : c
    ));
    setEditing(null);
  }

  async function handleDelete(id: string, catName: string) {
    if (!confirm(`Usunąć kategorię „${catName}"? Produkty stracą przypisanie do tej kategorii.`)) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Katalog · {categories.length} kategorii</div>
          <h1 className="page-title">Kategorie produktów</h1>
          <p className="page-subtitle">
            Kategorie są widoczne na karcie produktu i w breadcrumbie.
            Przypisz kategorie do produktów w edytorze produktu.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setErrorMsg(""); }}>
          <Icon name="plus" size={14} /> Nowa kategoria
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, maxWidth: 560 }}>
          <div className="serif" style={{ fontSize: 18, marginBottom: 16 }}>Nowa kategoria</div>
          <div className="col" style={{ gap: 14 }}>
            <div className="field">
              <div className="field-label">Nazwa <span style={{ color: "var(--error)" }}>*</span></div>
              <input
                className="input"
                autoFocus
                placeholder="np. Karma sucha"
                value={newName}
                onChange={(e) => handleNewNameChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <div className="field">
              <div className="field-label">Slug URL</div>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ color: "var(--text-tertiary)", fontSize: 13, whiteSpace: "nowrap" }}>/kategoria/</span>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={newSlug}
                  onChange={(e) => { setNewSlug(e.target.value); setNewSlugManual(true); }}
                />
                {newSlugManual && (
                  <button className="btn btn-quiet btn-sm" onClick={() => { setNewSlug(toSlug(newName)); setNewSlugManual(false); }}>
                    <Icon name="refresh" size={12} /> Reset
                  </button>
                )}
              </div>
              <div className="field-help">Automatycznie generowany z nazwy.</div>
            </div>
            {errorMsg && (
              <div style={{ padding: "10px 14px", background: "var(--error-soft)", borderRadius: 8, fontSize: 13, color: "var(--error)" }}>
                {errorMsg}
              </div>
            )}
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={saving || !newName.trim()}>
                {saving ? "Zapisuję…" : "Dodaj kategorię"}
              </button>
              <button className="btn btn-quiet btn-sm" onClick={() => { setShowForm(false); setNewName(""); setNewSlug(""); setNewSlugManual(false); setErrorMsg(""); }}>
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: "12px 8px" }}>
        {loading ? (
          <div style={{ padding: "24px 0", textAlign: "center", fontSize: 13, color: "var(--text-tertiary)" }}>
            Ładowanie kategorii…
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Slug URL</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editing?.id === cat.id;
                return (
                  <tr key={cat.id}>
                    <td>
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          className="input"
                          style={{ fontSize: 13.5 }}
                          value={editing.name}
                          onChange={(e) => handleEditNameChange(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") setEditing(null); }}
                        />
                      ) : (
                        <span style={{ fontWeight: 500, fontSize: 13.5 }}>{cat.name}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="row" style={{ gap: 6 }}>
                          <span style={{ color: "var(--text-tertiary)", fontSize: 12, whiteSpace: "nowrap" }}>/kategoria/</span>
                          <input
                            className="input"
                            style={{ fontSize: 12, flex: 1 }}
                            value={editing.slug}
                            onChange={(e) => setEditing((prev) => prev ? { ...prev, slug: e.target.value, slugManual: true } : prev)}
                          />
                        </div>
                      ) : (
                        <span className="tag tag-quiet" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>
                          /kategoria/{cat.slug}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="row" style={{ gap: 4 }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: "4px 10px", fontSize: 12 }}
                            onClick={handleSaveEdit}
                            disabled={editing.busy}
                          >
                            {editing.busy ? "…" : "Zapisz"}
                          </button>
                          <button className="btn btn-quiet btn-sm" style={{ padding: "4px 8px" }} onClick={() => setEditing(null)}>
                            <Icon name="x" size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="row" style={{ gap: 4 }}>
                          <button className="btn btn-quiet" style={{ padding: 6 }} onClick={() => startEdit(cat)} title="Edytuj">
                            <Icon name="edit" size={14} />
                          </button>
                          <button className="btn btn-quiet" style={{ padding: 6 }} onClick={() => handleDelete(cat.id, cat.name)} title="Usuń">
                            <Icon name="x" size={14} />
                          </button>
                        </div>
                      )}
                      {isEditing && editing.error && (
                        <div style={{ fontSize: 11, color: "var(--error)", marginTop: 4 }}>{editing.error}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: "40px 0", textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>
                    Brak kategorii. Kliknij „Nowa kategoria", żeby dodać pierwszą.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
