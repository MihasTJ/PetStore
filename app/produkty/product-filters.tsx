"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { X, ChevronDown } from "lucide-react"

type Category = { id: string; name: string; slug: string }

const SPECIES = [
  { value: "Pies", label: "Pies" },
  { value: "Kot",  label: "Kot" },
] as const

const LIFE_STAGES = [
  { value: "szczenie", label: "Szczenię / Kocię" },
  { value: "dorosly",  label: "Dorosły" },
  { value: "senior",   label: "Senior" },
] as const

const HEALTH_TAGS = [
  "Stawy", "Sierść", "Serce", "Waga", "Zęby", "Układ pokarmowy",
] as const

interface ProductFiltersProps {
  categories: Category[]
  breedTags: string[]
}

function Divider() {
  return <span className="hidden sm:block h-4 w-px bg-border-warm shrink-0" />
}

export function ProductFilters({ categories, breedTags }: ProductFiltersProps) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const currentCategory  = params.get("kategoria") ?? ""
  const currentSpecies   = params.get("gatunek") ?? ""
  const currentLifeStage = params.get("etap") ?? ""
  const currentBreed     = params.get("rasa") ?? ""
  const currentTags      = (params.get("tagi") ?? "").split(",").filter(Boolean).map(t => t.toLowerCase())
  const isPremium        = params.get("premium") === "1"
  const hasFilters       = Boolean(
    currentCategory || currentSpecies || currentLifeStage ||
    currentBreed || currentTags.length || isPremium
  )

  function buildUrl(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (!v) next.delete(k)
      else     next.set(k, v)
    }
    const qs = next.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  function setCategory(slug: string)  { router.push(buildUrl({ kategoria: slug || null })) }
  function setSpecies(val: string)    { router.push(buildUrl({ gatunek: val || null })) }
  function setLifeStage(val: string)  { router.push(buildUrl({ etap: val || null })) }
  function setBreed(val: string)      { router.push(buildUrl({ rasa: val || null })) }

  function toggleTag(tag: string) {
    const lc   = tag.toLowerCase()
    const next = currentTags.includes(lc)
      ? currentTags.filter(t => t !== lc)
      : [...currentTags, lc]
    router.push(buildUrl({ tagi: next.join(",") || null }))
  }

  function togglePremium() { router.push(buildUrl({ premium: isPremium ? null : "1" })) }

  const chip       = "rounded-tag px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer"
  const idle       = "border border-border-warm text-ink-muted hover:border-terracotta/50 hover:text-ink"
  const activeRed  = "border border-terracotta bg-terracotta text-card-warm"
  const activeTeal = "border border-terracotta bg-terracotta/8 text-terracotta"
  const activeMoss = "border border-moss bg-moss/8 text-moss"

  return (
    <div className="flex flex-col gap-2 py-3.5">

      {/* Wiersz 1: Kategoria + Gatunek */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.length > 0 && (
          <>
            <button
              onClick={() => setCategory("")}
              className={[chip, !currentCategory ? activeRed : idle].join(" ")}
            >
              Wszystkie
            </button>
            {categories.map(({ slug, name }) => (
              <button
                key={slug}
                onClick={() => setCategory(slug)}
                className={[chip, currentCategory === slug ? activeRed : idle].join(" ")}
              >
                {name}
              </button>
            ))}
            <Divider />
          </>
        )}
        {SPECIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSpecies(currentSpecies === value ? "" : value)}
            className={[chip, currentSpecies === value ? activeTeal : idle].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Wiersz 2: Etap życia + Tagi zdrowotne + Rasa + Premium + Wyczyść */}
      <div className="flex flex-wrap items-center gap-2">
        {LIFE_STAGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setLifeStage(currentLifeStage === value ? "" : value)}
            className={[chip, currentLifeStage === value ? activeTeal : idle].join(" ")}
          >
            {label}
          </button>
        ))}

        <Divider />

        {HEALTH_TAGS.map((tag) => {
          const active = currentTags.includes(tag.toLowerCase())
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={[chip, active ? activeTeal : idle].join(" ")}
            >
              {tag}
            </button>
          )
        })}

        <Divider />

        {breedTags.length > 0 && (
          <div className="relative shrink-0">
            <select
              value={currentBreed}
              onChange={(e) => setBreed(e.target.value)}
              className={[
                chip,
                "appearance-none pr-7 outline-none bg-transparent",
                currentBreed ? activeTeal : idle,
              ].join(" ")}
            >
              <option value="">Wszystkie rasy</option>
              {breedTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-subtle"
              strokeWidth={1.5}
            />
          </div>
        )}

        <button
          onClick={togglePremium}
          className={[chip, isPremium ? activeMoss : idle].join(" ")}
        >
          Premium Verified
        </button>

        {hasFilters && (
          <>
            <Divider />
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-terracotta transition-colors whitespace-nowrap"
            >
              <X size={11} />
              Wyczyść filtry
            </button>
          </>
        )}
      </div>

    </div>
  )
}
