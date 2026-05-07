import { useState } from "react";
import { PETS } from "./data";
import type { Pet } from "./types";
import { HealthTag, Icon, PetAvatar } from "./ui";

function PetDetail({ pet }: { pet: Pet }) {
  const reports = [
    { title: `Raport zdrowotny — ${pet.name}`, date: pet.lastReport, type: "Pełny profil + suplementacja",   flags: 1 },
    { title: "Plan diety dla seniora",          date: "18 mar 2026",  type: "Quiz #3 · rekomendacja",          flags: 0 },
    { title: "Profil stawów (kwartalny)",        date: "12 lut 2026",  type: "Quiz #2 · monitoring",            flags: 0 },
  ];

  const score = 78;

  return (
    <div className="col" style={{ gap: 16, position: "sticky", top: 80 }}>

      {/* Identity + health score */}
      <div className="card-tech">
        <div className="row" style={{ gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
          <PetAvatar name={pet.name} size="lg" />
          <div style={{ flex: 1 }}>
            <div className="eyebrow eyebrow-mossy">{pet.species} · {pet.breed}</div>
            <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, marginTop: 4 }}>{pet.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 4 }}>
              {pet.age} lat · {pet.weight} kg · właściciel: {pet.owner}
            </div>
          </div>
        </div>

        <div style={{ padding: 16, background: "var(--bg-card)", borderRadius: 14, border: "1px solid var(--border)" }}>
          <div className="row-between" style={{ marginBottom: 10 }}>
            <span className="eyebrow eyebrow-mossy">Score zdrowotny AI</span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>aktualizacja: {pet.lastReport}</span>
          </div>
          <div className="row" style={{ gap: 12, alignItems: "baseline", marginBottom: 10 }}>
            <span className="serif tabular" style={{ fontSize: 44, lineHeight: 1, color: "var(--secondary)" }}>{score}</span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>/ 100 — w normie dla rasy</span>
          </div>
          <div style={{ height: 4, background: "rgba(61,79,61,0.12)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${score}%`, height: "100%", background: "var(--secondary)" }} />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="eyebrow eyebrow-mossy" style={{ marginBottom: 8 }}>Predyspozycje rasy</div>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            {pet.predispositions.map((t) => <HealthTag key={t} name={t} />)}
          </div>
        </div>
      </div>

      {/* AI reports gallery */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 16 }}>
          <div>
            <div className="eyebrow">Raporty AI</div>
            <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>Galeria zdrowotna</div>
          </div>
          <button className="btn btn-quiet btn-sm"><Icon name="plus" size={12} /> Generuj</button>
        </div>
        <div className="col" style={{ gap: 10 }}>
          {reports.map((r, i) => (
            <div key={i} className="row" style={{ gap: 12, padding: 12, border: "1px solid var(--border)", borderRadius: 12, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 50, background: "var(--bg-warm-island)", borderRadius: 6, display: "grid", placeItems: "center", color: "var(--secondary)", flexShrink: 0 }}>
                <Icon name="fileText" size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{r.type} · {r.date}</div>
              </div>
              <button className="btn btn-quiet" style={{ padding: 6 }}><Icon name="download" size={14} /></button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export function PetsView() {
  const [selected, setSelected] = useState(PETS[1]);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Profile pupili · {PETS.length} aktywnych</div>
          <h1 className="page-title">Pet Health<br/>Management</h1>
          <p className="page-subtitle">
            Każdy profil to pamięć — rasa, wiek, predyspozycje. Z tej pamięci AI buduje raporty zdrowotne i alerty prewencyjne.
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={14} /> Nowy profil</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 480px", gap: 24, alignItems: "flex-start" }}>
        <div className="card" style={{ padding: "12px 8px" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Pupil</th>
                <th>Rasa · wiek</th>
                <th>Waga</th>
                <th>Predyspozycje</th>
                <th style={{ textAlign: "center" }}>Raporty</th>
                <th style={{ textAlign: "center" }}>Alerty</th>
              </tr>
            </thead>
            <tbody>
              {PETS.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  style={{ cursor: "pointer", background: selected.id === p.id ? "var(--primary-softer)" : undefined }}
                >
                  <td>
                    <div className="row" style={{ gap: 12 }}>
                      <PetAvatar name={p.name} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{p.owner}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{p.breed}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{p.species} · {p.age} lat</div>
                  </td>
                  <td className="tabular">{p.weight} kg</td>
                  <td>
                    <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                      {p.predispositions.slice(0, 2).map((t) => <HealthTag key={t} name={t} />)}
                      {p.predispositions.length > 2 && (
                        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>+{p.predispositions.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }} className="tabular">{p.reports}</td>
                  <td style={{ textAlign: "center" }} className="tabular">
                    {p.alerts > 0
                      ? <span className="tag tag-rust">{p.alerts}</span>
                      : <span style={{ color: "var(--text-tertiary)" }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PetDetail pet={selected} />
      </div>
    </div>
  );
}
