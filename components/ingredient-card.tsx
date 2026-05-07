"use client"

import { useState } from "react"
import { Check, Info } from "lucide-react"

type Props = {
  name: string
  amount?: string | null
  description?: string | null
  isHighlighted: boolean
}

export function IngredientCard({ name, amount, description, isHighlighted }: Props) {
  const [open, setOpen] = useState(false)

  const hasTooltip = Boolean(description)

  return (
    <div
      className={`bg-card-warm rounded-card-sm p-5 shadow-warm ${hasTooltip ? "cursor-pointer" : ""}`}
      onClick={() => hasTooltip && setOpen((v) => !v)}
      role={hasTooltip ? "button" : undefined}
      tabIndex={hasTooltip ? 0 : undefined}
      onKeyDown={(e) => {
        if (hasTooltip && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          setOpen((v) => !v)
        }
      }}
      aria-expanded={hasTooltip ? open : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {isHighlighted && (
            <span
              className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-moss/10"
              aria-label="Kluczowy składnik"
            >
              <Check size={9} className="text-moss" strokeWidth={2.5} />
            </span>
          )}
          <p className="text-sm font-medium text-ink leading-snug">{name}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {amount && (
            <span className="font-tnum text-xs text-ink-subtle bg-warm-island rounded-tag px-2 py-1">
              {amount}
            </span>
          )}
          {hasTooltip && (
            <Info
              size={13}
              className={`transition-colors ${open ? "text-terracotta" : "text-ink-subtle"}`}
              aria-hidden
            />
          )}
        </div>
      </div>

      {hasTooltip && open && (
        <p className="mt-3 pt-3 border-t border-border-warm text-[13px] leading-body text-ink-muted">
          {description}
        </p>
      )}
    </div>
  )
}
