"use client"

import { useEffect, useState } from "react"

type Section = { id: string; title: string }

export function TableOfContents({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-10% 0px -80% 0px" },
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <nav className="hidden md:block md:col-span-3 md:pr-8" aria-label="Spis treści">
      <div className="sticky top-28">
        <p className="mb-4 text-[11px] font-medium tracking-eyebrow text-ink-muted uppercase">
          Spis treści
        </p>
        <ul className="flex flex-col gap-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block text-xs leading-relaxed transition-colors ${
                  activeId === s.id
                    ? "font-medium text-ink"
                    : "text-ink-subtle hover:text-ink"
                }`}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
