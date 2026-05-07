import { useState } from "react";
import { ALERTS } from "./data";
import { HealthTag, Icon } from "./ui";

/* ─── Alerts panel ─────────────────────────────────────────────────────── */

function AlertsPanel() {
  return (
    <div className="card">
      <div className="row-between" style={{ marginBottom: 16 }}>
        <div>
          <div className="eyebrow eyebrow-rust">AI Alerty</div>
          <h2 className="section-title" style={{ marginTop: 4 }}>Zaplanowane przypomnienia</h2>
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="settings" size={14} /> Reguły</button>
      </div>
      <div className="col" style={{ gap: 12 }}>
        {ALERTS.map((a) => (
          <div
            key={a.id}
            className="row"
            style={{ gap: 14, padding: "16px 16px", border: "1px solid var(--border)", borderRadius: 14, alignItems: "flex-start" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: a.priority === "high" ? "rgba(184,101,74,0.10)" : a.priority === "medium" ? "rgba(168,123,92,0.14)" : "rgba(61,79,61,0.08)",
                color:      a.priority === "high" ? "var(--primary)"        : a.priority === "medium" ? "#A87B5C"                : "var(--secondary)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={a.priority === "high" ? "alert" : "clock"} size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{a.type}</span>
                <span className="tag tag-quiet">{a.pet} · {a.owner}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 6 }}>{a.message}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Wysyłka: {a.scheduled}</div>
            </div>
            <button className="btn btn-quiet btn-sm">Edytuj</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Quiz management ──────────────────────────────────────────────────── */

function QuizManagement() {
  const questions = [
    { id: 1, q: "Jaki gatunek ma Twój pupil?",                           type: "select", answers: 4,  conv: 100 },
    { id: 2, q: "Ile lat ma [imię pupila]?",                             type: "range",  answers: 12, conv: 94  },
    { id: 3, q: "Jaka jest aktualna waga?",                              type: "number", answers: 1,  conv: 89  },
    { id: 4, q: "Czy zauważasz problemy ze stawami?",                    type: "multi",  answers: 6,  conv: 82  },
    { id: 5, q: "Jak wygląda dieta na co dzień?",                        type: "multi",  answers: 8,  conv: 78  },
    { id: 6, q: "Czy [imię] ma rasę z predyspozycjami zdrowotnymi?",     type: "select", answers: 24, conv: 71  },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
      <div className="card">
        <div className="row-between" style={{ marginBottom: 16 }}>
          <div>
            <div className="eyebrow eyebrow-rust">Lejek pytań</div>
            <h2 className="section-title" style={{ marginTop: 4 }}>Sekwencja quizu zdrowotnego</h2>
          </div>
          <button className="btn btn-ghost btn-sm"><Icon name="plus" size={14} /> Nowe pytanie</button>
        </div>

        <div className="col" style={{ gap: 8 }}>
          {questions.map((q, i) => (
            <div key={q.id} className="row" style={{ gap: 14, padding: "16px 16px", border: "1px solid var(--border)", borderRadius: 14, alignItems: "center" }}>
              <button className="btn btn-quiet" style={{ padding: 4 }}>
                <Icon name="grip" size={14} color="var(--text-tertiary)" />
              </button>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-warm-island)", color: "var(--secondary)", display: "grid", placeItems: "center", fontSize: 12, fontFamily: "var(--font-serif)" }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, marginBottom: 3 }}>{q.q}</div>
                <div className="row" style={{ gap: 8, fontSize: 11, color: "var(--text-tertiary)" }}>
                  <span className="tag tag-quiet">{q.type}</span>
                  <span>{q.answers} odpowiedzi</span>
                </div>
              </div>
              <div style={{ width: 100, textAlign: "right" }}>
                <div className="tabular" style={{ fontSize: 14, fontWeight: 500, color: q.conv > 80 ? "var(--secondary)" : "var(--primary)" }}>
                  {q.conv}%
                </div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>kontynuuje</div>
              </div>
              <button className="btn btn-quiet" style={{ padding: 6 }}><Icon name="edit" size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="col" style={{ gap: 16 }}>
        <div className="card-tech">
          <div className="eyebrow eyebrow-mossy" style={{ marginBottom: 8 }}>Konwersja</div>
          <div className="serif tabular" style={{ fontSize: 36, lineHeight: 1, color: "var(--secondary)" }}>28.4%</div>
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
            quiz ukończony → zakup w ciągu 7 dni
          </div>
          <div className="divider" style={{ background: "rgba(61,79,61,0.16)" }} />
          <div className="col" style={{ gap: 10, fontSize: 12 }}>
            <div className="row-between"><span style={{ color: "var(--text-secondary)" }}>Quiz rozpoczęty</span><span className="tabular">3 210</span></div>
            <div className="row-between"><span style={{ color: "var(--text-secondary)" }}>Quiz ukończony</span><span className="tabular">2 074</span></div>
            <div className="row-between"><span style={{ color: "var(--text-secondary)" }}>Raport otwarty</span><span className="tabular">1 582</span></div>
            <div className="row-between" style={{ color: "var(--secondary)", fontWeight: 500 }}>
              <span>Zakup</span><span className="tabular">589</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="eyebrow eyebrow-rust" style={{ marginBottom: 8 }}>Najczęstsze rekomendacje</div>
          <div className="col" style={{ gap: 10, marginTop: 12 }}>
            {[
              { n: "Olej z łososia",        c: 142 },
              { n: "Suplement na stawy",     c: 98  },
              { n: "Karma dla seniora",      c: 64  },
              { n: "Probiotyk",              c: 41  },
            ].map((r) => (
              <div key={r.n} className="row-between" style={{ fontSize: 13 }}>
                <span>{r.n}</span>
                <span className="tabular" style={{ color: "var(--text-secondary)" }}>{r.c} rekom.</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Breed database ───────────────────────────────────────────────────── */

function BreedDatabase() {
  const breeds = [
    { name: "Golden Retriever",       species: "Pies", count: 24, predispositions: ["Stawy", "Serce", "Waga"]    },
    { name: "Labrador",               species: "Pies", count: 18, predispositions: ["Stawy", "Waga"]             },
    { name: "Yorkshire Terrier",      species: "Pies", count: 12, predispositions: ["Zęby", "Stawy", "Serce"]    },
    { name: "Maine Coon",             species: "Kot",  count: 9,  predispositions: ["Serce", "Stawy"]            },
    { name: "Ragdoll",                species: "Kot",  count: 7,  predispositions: ["Serce", "Sierść"]           },
    { name: "Border Collie",          species: "Pies", count: 6,  predispositions: ["Stawy", "Wzrok"]            },
  ];

  return (
    <div className="card" style={{ padding: "12px 8px" }}>
      <table className="table">
        <thead>
          <tr>
            <th>Rasa</th>
            <th>Gatunek</th>
            <th>Profile w bazie</th>
            <th>Predyspozycje rasy</th>
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {breeds.map((b) => (
            <tr key={b.name}>
              <td><span style={{ fontWeight: 500 }}>{b.name}</span></td>
              <td>{b.species}</td>
              <td className="tabular">{b.count}</td>
              <td>
                <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                  {b.predispositions.map((p) => <HealthTag key={p} name={p} />)}
                </div>
              </td>
              <td><button className="btn btn-quiet btn-sm">Reguły</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main view ────────────────────────────────────────────────────────── */

type Tab = "quiz" | "alerts" | "breeds";

export function IntelligenceView() {
  const [tab, setTab] = useState<Tab>("quiz");

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">AI Intelligence · silnik reguł v1</div>
          <h1 className="page-title">Quiz, raporty,<br/>alerty prewencyjne</h1>
          <p className="page-subtitle">
            To jest jedyna strefa, gdzie pozwalamy sobie na dane i wykresy — stonowane. „Wellness lab", nie cyber.
          </p>
        </div>
      </div>

      <div className="segmented" style={{ marginBottom: 24 }}>
        <button className={tab === "quiz"   ? "active" : ""} onClick={() => setTab("quiz")}>Quiz zdrowotny</button>
        <button className={tab === "alerts" ? "active" : ""} onClick={() => setTab("alerts")}>Reguły alertów</button>
        <button className={tab === "breeds" ? "active" : ""} onClick={() => setTab("breeds")}>Baza ras</button>
      </div>

      {tab === "quiz"   && <QuizManagement />}
      {tab === "alerts" && <AlertsPanel />}
      {tab === "breeds" && <BreedDatabase />}
    </div>
  );
}
