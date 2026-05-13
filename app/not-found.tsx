import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-canvas min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs font-medium tracking-eyebrow text-ink-muted uppercase mb-6">
          Strona nie istnieje
        </p>
        <h1 className="font-serif font-normal text-ink text-4xl md:text-5xl leading-editorial mb-6">
          Nie możemy znaleźć<br />tej strony.
        </h1>
        <p className="text-base leading-body text-ink-muted mb-10">
          Produkt mógł zostać przeniesiony lub usunięty. Sprawdź nasz katalog — może jest tam coś dla Twojego pupila.
        </p>
        <Link
          href="/produkty"
          className="inline-flex items-center gap-2 rounded-button px-6 py-3 bg-terracotta text-card-warm text-sm font-medium hover:bg-terracotta-hover transition-colors"
        >
          <ArrowLeft size={15} />
          Wróć do katalogu
        </Link>
      </div>
    </main>
  );
}
