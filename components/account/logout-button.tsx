"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="flex items-center gap-2 py-3 text-sm text-ink-muted hover:text-ink transition-colors w-full text-left disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
    >
      <LogOut size={14} strokeWidth={1.5} />
      {pending ? "Wylogowywanie…" : "Wyloguj się"}
    </button>
  );
}
