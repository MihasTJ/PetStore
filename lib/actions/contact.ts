"use server"

import { Resend } from "resend"
import { contactConfirmationHtml } from "@/lib/email/contact-confirmation"

export type ContactState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | { status: "error"; message: string }

const SUBJECT_LABELS: Record<string, string> = {
  produkt: "Pytanie o produkt",
  zamowienie: "Pytanie o zamówienie",
  reklamacja: "Reklamacja",
  zwrot: "Zwrot towaru",
  inne: "Inne",
}

export async function submitContactForm(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get("name") as string | null)?.trim()
  const email = (formData.get("email") as string | null)?.trim()
  const subject = (formData.get("subject") as string | null)?.trim()
  const message = (formData.get("message") as string | null)?.trim()

  if (!name || !email || !subject || !message) {
    return { status: "error", message: "Wypełnij wszystkie pola formularza." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Podaj prawidłowy adres e-mail." }
  }
  if (message.length < 10) {
    return { status: "error", message: "Wiadomość jest za krótka." }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log("[contact] RESEND_API_KEY not set — skipping email send", { name, email, subject, message })
    return { status: "success", email }
  }

  const resend = new Resend(apiKey)
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject
  const fromEmail = process.env.RESEND_FROM ?? "onboarding@resend.dev"
  const adminEmail = process.env.ADMIN_EMAIL

  // 1. Potwierdzenie do osoby która napisała
  const { error: confirmError } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `Twoja wiadomość dotarła — Nobile Pet Care`,
    html: contactConfirmationHtml({ name, subjectLabel }),
    text: `Cześć ${name},\n\nOtrzymaliśmy Twoją wiadomość (${subjectLabel}) i odezwiemy się wkrótce — zwykle tego samego lub następnego dnia roboczego.\n\nNobile Pet Care\nkontakt@nobilepetcare.pl`,
  })

  if (confirmError) {
    console.error("[contact] Resend confirmation error", confirmError)
    return { status: "error", message: "Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na kontakt@nobilepetcare.pl." }
  }

  // 2. Powiadomienie do admina (tylko gdy ADMIN_EMAIL ustawiony)
  if (adminEmail) {
    const { error: adminError } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `[Kontakt] ${subjectLabel} — ${name}`,
      text: `Imię: ${name}\nE-mail: ${email}\nTemat: ${subjectLabel}\n\n${message}`,
    })
    if (adminError) {
      console.error("[contact] Resend admin notification error", adminError)
    }
  } else {
    console.warn("[contact] ADMIN_EMAIL not set — admin notification skipped")
  }

  return { status: "success", email }
}
