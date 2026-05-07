import { Bot, Search, SlidersHorizontal, ShieldCheck, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type BrandExpert = {
  id: string
  name: string
  role: string
  description: string | null
  specialization_tags: string[]
  ai_generated_avatar_url: string | null
}

export const metadata = {
  title: "Panel Cyfrowych Kuratorów — Premium Pet Care",
  description:
    "Wiktor i Julia analizują tysiące badań żywieniowych i danych o rasach, żebyś nie musiał.",
}

export default async function EksperciPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("brand_experts")
    .select("id, name, role, description, specialization_tags, ai_generated_avatar_url")
    .eq("is_active", true)
    .order("name")

  const experts: BrandExpert[] = data ?? []

  return (
    <main className="bg-canvas">

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-20 pb-16 md:px-12 md:pt-32 md:pb-24">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Cyfrowi Kuratorzy
        </p>
        <div className="max-w-2xl">
          <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl lg:text-7xl">
            Panel Cyfrowych<br />Kuratorów
          </h1>
          <p className="mt-8 text-lg leading-body text-ink-muted max-w-lg">
            Analizujemy tysiące badań żywieniowych i danych o rasach —
            żebyś nie musiał.
          </p>
        </div>
      </section>

      {/* ── 2. TRANSPARENTNOŚĆ (eksponowana pozytywnie — wymóg prawny) ─ */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-12 md:px-12 md:py-16">
          <div className="rounded-card bg-card-warm p-8 shadow-warm-md md:p-10 flex items-start gap-6">
            <div className="shrink-0 mt-0.5 flex items-center justify-center w-10 h-10 rounded-field bg-terracotta/10">
              <Bot size={20} className="text-terracotta" />
            </div>
            <div>
              <p className="mb-3 text-xs font-medium tracking-eyebrow text-terracotta uppercase">
                Technologia kuratorska
              </p>
              <p className="text-base leading-body text-ink md:text-lg">
                Wiktor i Julia to cyfrowi Kuratorzy — syntetyzujemy tysiące badań żywieniowych
                i danych o rasach, żebyś nie musiał. To nie zastępuje weterynarza, ale daje
                Ci wiedzę, z którą idziesz do gabinetu przygotowany.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. KARTY EKSPERTÓW ──────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Poznaj Kuratorów
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Wiedza, która pracuje<br />na Twój spokój ducha.
          </h2>

          {experts.length === 0 ? (
            <p className="text-base text-ink-muted">Brak aktywnych Kuratorów.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  className="bg-card-warm rounded-card p-8 shadow-warm"
                >
                  <div className="mb-6 flex items-center gap-5">
                    {expert.ai_generated_avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={expert.ai_generated_avatar_url}
                        alt={expert.name}
                        width={72}
                        height={72}
                        className="w-[72px] h-[72px] shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        aria-label={`Avatar ${expert.name}`}
                        className="w-[72px] h-[72px] shrink-0 rounded-full bg-warm-island flex items-center justify-center"
                      >
                        <span className="font-serif text-2xl font-normal text-ink-muted">
                          {expert.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-medium text-ink">{expert.name}</p>
                      <p className="mt-1 text-sm leading-body text-ink-muted">
                        {expert.role}
                      </p>
                    </div>
                  </div>

                  {expert.description && (
                    <p className="mb-6 text-[15px] leading-body text-ink-muted">
                      {expert.description}
                    </p>
                  )}

                  {expert.specialization_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {expert.specialization_tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-tag px-3 py-1 text-[11px] font-medium"
                          style={{
                            backgroundColor: "rgba(61,79,61,0.08)",
                            color: "#3D4F3D",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. METODOLOGIA ──────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Metodologia
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Jak działają nasi Kuratorzy?
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: Search,
                step: "01",
                title: "Analizujemy składy",
                body: "Każdy suplement i karma przechodzą analizę składu — aktywne substancje, biodostępność, czystość formuły.",
              },
              {
                Icon: SlidersHorizontal,
                step: "02",
                title: "Dopasowujemy do rasy i etapu życia",
                body: "Potrzeby bokserka seniora różnią się od potrzeb szczeniaka border collie. Każda rekomendacja uwzględnia te różnice.",
              },
              {
                Icon: ShieldCheck,
                step: "03",
                title: "Weryfikujemy zgodność z normami żywieniowymi",
                body: "Proporcje składników i wzajemne interakcje — wszystko sprawdzane pod kątem aktualnych standardów żywienia.",
              },
            ].map(({ Icon, step, title, body }) => (
              <div
                key={step}
                className="bg-card-warm rounded-card-sm p-6 shadow-warm"
              >
                <div className="mb-5 flex items-start justify-between">
                  <Icon size={20} className="text-terracotta" />
                  <span className="font-tnum text-xs text-ink-subtle">{step}</span>
                </div>
                <p className="mb-3 text-base font-medium text-ink">{title}</p>
                <p className="text-sm leading-body text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ──────────────────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Przejrzystość marki
          </p>
          <h2 className="mb-6 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl max-w-lg">
            Każda odznaka ma swoje kryteria.
          </h2>
          <p className="mb-10 max-w-md text-base leading-body text-ink-muted">
            Dowiedz się, jakie standardy musi spełnić produkt, żeby trafić na naszą półkę.
          </p>
          <a
            href="/standardy-jakosci"
            className="inline-flex items-center gap-2.5 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover"
          >
            Zobacz standardy jakości
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

    </main>
  )
}
