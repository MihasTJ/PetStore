"use client"

import { useState, useRef, useEffect } from "react"
import { Share2, Copy, Check, Download, X } from "lucide-react"

interface ShareButtonProps {
  productName: string
  productSlug: string
  shareUrl?: string
  variant?: "product" | "confirmation"
  petName?: string | null
  className?: string
}

export function ShareButton({
  productName,
  productSlug,
  shareUrl,
  variant = "product",
  petName,
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const productUrl = shareUrl
    ? shareUrl.startsWith("/") ? `${origin}${shareUrl}` : shareUrl
    : `${origin}/products/${productSlug}`

  const shareText =
    variant === "confirmation"
      ? `Właśnie zadbałem/am o ${petName ?? "mojego pupila"}! ${productName} — sprawdzony skład od Nobile Pet Care.`
      : `Polecam ${productName} — skład zweryfikowany przez Kuratorów Nobile Pet Care.`

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  async function handleClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: productName, text: shareText, url: productUrl })
        return
      } catch {
        // user cancelled or API unavailable — fall through to popover
      }
    }
    setOpen((o) => !o)
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // clipboard API not available
    }
  }

  const fbUrl  = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
  const waUrl  = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${productUrl}`)}`
  const ogUrl  = `/api/og/${productSlug}`

  const baseBtn =
    "inline-flex items-center gap-2 rounded-button border border-border-warm px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-terracotta/50 hover:text-terracotta"

  return (
    <div className={`relative inline-block ${className ?? ""}`}>
      <button
        onClick={handleClick}
        className={baseBtn}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Share2 size={15} strokeWidth={1.5} />
        Podziel się z Pet Parents
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />

          {/* Popover */}
          <div
            ref={popoverRef}
            role="menu"
            className="absolute left-0 top-full z-50 mt-2 w-64 rounded-card-sm border border-border-warm bg-canvas shadow-warm"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-warm">
              <span className="text-[11px] font-medium tracking-eyebrow uppercase text-ink-subtle">
                Udostępnij
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors"
                aria-label="Zamknij"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>

            <div className="py-1.5">
              {/* Copy link */}
              <button
                onClick={copyLink}
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:bg-warm-island hover:text-ink transition-colors"
              >
                {copied
                  ? <Check size={14} strokeWidth={1.5} className="text-moss shrink-0" />
                  : <Copy size={14} strokeWidth={1.5} className="shrink-0" />
                }
                {copied ? "Skopiowano!" : "Kopiuj link"}
              </button>

              {/* Facebook */}
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:bg-warm-island hover:text-ink transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>

              {/* WhatsApp */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:bg-warm-island hover:text-ink transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>

              <div className="my-1.5 border-t border-border-warm" />

              {/* Download OG card */}
              <a
                href={ogUrl}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:bg-warm-island hover:text-ink transition-colors"
              >
                <Download size={14} strokeWidth={1.5} className="shrink-0" />
                <span>
                  Grafika do IG / Stories
                  <span className="block text-[11px] text-ink-subtle">Otwórz i zapisz zdjęcie</span>
                </span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
