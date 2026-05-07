"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { X } from "lucide-react"

const SPECIES = [
  { value: "",    label: "Wszystkie" },
  { value: "Pies", label: "Pies" },
  { value: "Kot",  label: "Kot" },
] as const

const HEALTH_TAGS = [
  "Stawy", "Sierść", "Serce", "Waga", "Zęby", "Układ pokarmowy",
] as const

export function ProductFilters() {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const currentSpecies = params.get("gatunek") ?? ""
  const currentTags    = (params.get("tagi") ?? "").split(",").filter(Boolean).map(t => t.toLowerCase())
  const isPremium      = params.get("premium") === "1"
  const hasFilters     = Boolean(currentSpecies || currentTags.length || isPremium)

  function buildUrl(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (!v) next.delete(k)
      else     next.set(k, v)
    }
    const qs = next.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  function setSpecies(val: string) {
    router.push(buildUrl({ gatunek: val || null }))
  }

  function toggleTag(tag: string) {
    const lc   = tag.toLowerCase()
    const next = currentTags.includes(lc)
      ? currentTags.filter(t => t !== lc)
      : [...currentTags, lc]
    router.push(buildUrl({ tagi: next.join(",") || null }))
  }

  function togglePremium() {
    router.push(buildUrl({ premium: isPremium ? null : "1" }))
  }

  return (
    <div className="flex items-center gap-2.5 py-3.5 overflow-x-auto"
      style={{ scrollbarWidth: "none" }}>

      {/* Gatunek */}
      <div className="flex items-center gap-1.5 shrink-0">
        {SPECIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSpecies(value)}
            className={[
              "rounded-tag px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap",
              currentSpecies === value
                ? "bg-terracotta text-card-warm"
                : "border border-border-warm text-ink-muted hover:border-terracotta/50 hover:text-ink",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-border-warm shrink-0" />

      {/* Tagi zdrowotne */}
      <div className="flex items-center gap-1.5 shrink-0">
        {HEALTH_TAGS.map((tag) => {
          const active = currentTags.includes(tag.toLowerCase())
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={[
                "rounded-tag px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap",
                active
                  ? "border border-terracotta bg-terracotta/8 text-terracotta"
                  : "border border-border-warm text-ink-muted hover:border-terracotta/50 hover:text-ink",
              ].join(" ")}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <div className="h-4 w-px bg-border-warm shrink-0" />

      {/* Premium toggle */}
      <button
        onClick={togglePremium}
        className={[
          "rounded-tag px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0",
          isPremium
            ? "border border-moss bg-moss/8 text-moss"
            : "border border-border-warm text-ink-muted hover:border-moss/50 hover:text-ink",
        ].join(" ")}
      >
        Premium Verified
      </button>

      {/* Wyczyść */}
      {hasFilters && (
        <>
          <div className="h-4 w-px bg-border-warm shrink-0" />
          <button
            onClick={() => router.push(pathname)}
            className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-terracotta transition-colors whitespace-nowrap shrink-0"
          >
            <X size={11} />
            Wyczyść filtry
          </button>
        </>
      )}
    </div>
  )
}
