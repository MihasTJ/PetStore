import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/account/login-form";

export const metadata = {
  title: "Zaloguj się — Nobile",
  description: "Zaloguj się i wróć do profilu swojego pupila.",
};

export default function LogowaniePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[480px] px-6 pt-28 pb-24 md:pt-36">

        <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
          Konto
        </p>
        <h1 className="font-serif font-normal text-4xl md:text-[2.75rem] text-ink leading-editorial mb-3">
          Zaloguj się.
        </h1>
        <p className="text-base leading-body text-ink-muted mb-10">
          Wróć do profilu swojego pupila i historii zdrowotnej.
        </p>

        <LoginForm />

        <div className="mt-8 flex items-start gap-2.5">
          <ShieldCheck size={14} strokeWidth={1.5} className="text-moss shrink-0 mt-0.5" />
          <p className="text-xs leading-body text-ink-subtle">
            Twoje dane są szyfrowane i nie są udostępniane podmiotom trzecim.
          </p>
        </div>

      </div>
    </main>
  );
}
