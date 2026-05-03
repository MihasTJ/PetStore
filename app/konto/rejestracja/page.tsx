import { RegistrationForm } from "@/components/account/registration-form";

export const metadata = {
  title: "Utwórz konto — Nobile",
  description: "Dołącz do rodziny Nobile i utwórz profil swojego pupila.",
};

export default function RejestracjaPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[540px] px-6 pt-28 pb-24 md:pt-36">

        <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
          Nowe konto
        </p>
        <h1 className="font-serif font-normal text-4xl md:text-[2.75rem] text-ink leading-editorial mb-3">
          Dołącz do rodziny Nobile.
        </h1>
        <p className="text-base leading-body text-ink-muted mb-10">
          Utwórz profil swojego pupila i zacznij korzystać ze spersonalizowanych
          rekomendacji zdrowotnych.
        </p>

        {/* Docelowo: Supabase Auth signUp + INSERT do pet_profiles */}
        <RegistrationForm />

      </div>
    </main>
  );
}
