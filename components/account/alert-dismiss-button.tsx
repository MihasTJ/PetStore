"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AlertDismissButton({ alertId }: { alertId: string }) {
  const [pending, startTransition] = useTransition();

  function dismiss() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from("ai_alerts")
        .update({ is_sent: true, sent_at: new Date().toISOString() })
        .eq("id", alertId);
      // Revalidate is handled by a full page re-render after dismiss;
      // for optimistic UI, the parent can use router.refresh()
    });
  }

  return (
    <button
      type="button"
      aria-label="Zamknij alert"
      disabled={pending}
      onClick={dismiss}
      className="shrink-0 text-ink-subtle hover:text-ink transition-colors mt-0.5 disabled:opacity-40"
    >
      <X size={14} strokeWidth={1.5} />
    </button>
  );
}
