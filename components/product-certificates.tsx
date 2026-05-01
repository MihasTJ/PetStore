import { ShieldCheck, BadgeCheck, Award, FileText } from "lucide-react";

type Certificate = {
  id: string;
  name: string;
  issuingBody: string;
  validUntil: string;
  description: string;
  pdfUrl?: string;
};

const certificates: Certificate[] = [
  {
    id: "vet-verified",
    name: "Weterynaryjnie zweryfikowany",
    issuingBody: "Polska Izba Weterynarzy",
    validUntil: "31.12.2026",
    description:
      "Skład przeszedł pełną weryfikację pod kątem bezpieczeństwa dla psów i kotów — w tym ras predysponowanych do alergii.",
    pdfUrl: "#",
  },
  {
    id: "biotest",
    name: "Bez szkodliwych dodatków",
    issuingBody: "Laboratorium BioTest (niezależne)",
    validUntil: "30.06.2026",
    description:
      "Niezależne badanie laboratoryjne potwierdza brak konserwantów syntetycznych, barwników i substancji szkodliwych.",
    pdfUrl: "#",
  },
  {
    id: "premium-verified",
    name: "Premium Verified",
    issuingBody: "Nobile Quality Board",
    validUntil: "31.03.2027",
    description:
      "Produkt spełnia nasze wewnętrzne standardy Premium — skład, dawkowanie i producent przeszli pełny audyt jakości.",
    pdfUrl: "#",
  },
];

const iconFor = {
  "vet-verified": ShieldCheck,
  biotest: BadgeCheck,
  "premium-verified": Award,
} as const;

export function ProductCertificates() {
  return (
    <section className="bg-warm-island">
      <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

        <div className="mb-12">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Certyfikaty i bezpieczeństwo
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                Zanim kupisz — sprawdź,<br />
                co kryje się w składzie.
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
              <p className="text-base leading-body text-ink-muted">
                Każdy certyfikat możesz pobrać i zweryfikować samodzielnie.
                Przejrzystość składu to nie opcja — to standard.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {certificates.map((cert) => {
            const Icon = iconFor[cert.id as keyof typeof iconFor] ?? ShieldCheck;
            return (
              <div
                key={cert.id}
                className="flex flex-col bg-card-warm rounded-card-sm p-6 shadow-warm"
              >
                <div
                  className="mb-4 flex items-center justify-center rounded-tag"
                  style={{ width: 40, height: 40, backgroundColor: "rgba(61,79,61,0.10)" }}
                >
                  <Icon size={20} className="text-moss" />
                </div>

                <p className="text-sm font-medium text-ink">{cert.name}</p>
                <p className="mt-1.5 text-xs leading-body text-ink-muted flex-1">
                  {cert.description}
                </p>

                <div className="mt-5 pt-4 border-t border-border-warm flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-ink-subtle">{cert.issuingBody}</p>
                    <p className="text-[11px] text-ink-subtle">Ważny do: {cert.validUntil}</p>
                  </div>
                  {cert.pdfUrl && (
                    <a
                      href={cert.pdfUrl}
                      className="inline-flex items-center gap-1 text-xs text-terracotta hover:text-terracotta-hover transition-colors shrink-0"
                      aria-label={`Pobierz certyfikat: ${cert.name}`}
                    >
                      <FileText size={13} />
                      PDF
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-ink-subtle text-center">
          Certyfikaty są regularnie odnawiane. Daty ważności weryfikujemy co kwartał.
        </p>
      </div>
    </section>
  );
}
