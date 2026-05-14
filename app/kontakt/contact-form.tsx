"use client"

import { useActionState } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm, type ContactState } from "@/lib/actions/contact"

const INITIAL: ContactState = { status: "idle" }

const SUBJECTS = [
  { value: "produkt",    label: "Pytanie o produkt" },
  { value: "zamowienie", label: "Pytanie o zamówienie" },
  { value: "reklamacja", label: "Reklamacja" },
  { value: "zwrot",      label: "Zwrot towaru" },
  { value: "inne",       label: "Inne" },
]

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, INITIAL)

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-6 rounded-card bg-warm-island px-8 py-10">
        <CheckCircle size={22} className="text-moss shrink-0" strokeWidth={1.5} />
        <div className="flex flex-col gap-3">
          <p className="font-serif font-normal text-2xl text-ink leading-snug">
            Dostaliśmy Twoją wiadomość.
          </p>
          <p className="text-sm leading-body text-ink-muted">
            Wysłaliśmy potwierdzenie na{" "}
            <span className="font-medium text-ink">{state.email}</span>.
            Odezwiemy się zwykle tego samego lub następnego dnia roboczego.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-5">

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Imię */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-ink-muted uppercase tracking-eyebrow">
            Imię
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Twoje imię"
            className="w-full rounded-field border border-border-warm bg-card-warm px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none transition-shadow focus:border-terracotta focus:shadow-warm-focus"
          />
        </div>

        {/* E-mail */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-ink-muted uppercase tracking-eyebrow">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Twój adres e-mail"
            className="w-full rounded-field border border-border-warm bg-card-warm px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none transition-shadow focus:border-terracotta focus:shadow-warm-focus"
          />
        </div>
      </div>

      {/* Temat */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-xs font-medium text-ink-muted uppercase tracking-eyebrow">
          Temat
        </label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          className="w-full rounded-field border border-border-warm bg-card-warm px-4 py-3 text-sm text-ink outline-none transition-shadow focus:border-terracotta focus:shadow-warm-focus appearance-none cursor-pointer"
        >
          <option value="" disabled className="text-ink-subtle">
            Wybierz temat
          </option>
          {SUBJECTS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Wiadomość */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-ink-muted uppercase tracking-eyebrow">
          Wiadomość
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Opisz, jak możemy pomóc Tobie i Twojemu pupilowi…"
          className="w-full rounded-field border border-border-warm bg-card-warm px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none transition-shadow focus:border-terracotta focus:shadow-warm-focus resize-none leading-body"
        />
      </div>

      {/* Błąd */}
      {state.status === "error" && (
        <div className="flex items-start gap-2.5 rounded-field border border-error-warm/30 bg-error-warm/5 px-4 py-3">
          <AlertCircle size={15} className="text-error-warm shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-sm leading-body text-error-warm">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center gap-2.5 rounded-button bg-terracotta px-8 py-4 text-sm font-medium text-card-warm transition-colors hover:bg-terracotta-hover disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-card-warm/30 border-t-card-warm animate-spin" />
            Wysyłanie…
          </>
        ) : (
          <>
            Wyślij wiadomość
            <Send size={14} strokeWidth={1.5} />
          </>
        )}
      </button>

    </form>
  )
}
