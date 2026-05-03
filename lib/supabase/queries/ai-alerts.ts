import { createClient } from "@/lib/supabase/server";
import type { AiAlert } from "@/types/database";

export async function getActiveAlerts(customerId: string): Promise<AiAlert[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_alerts")
    .select("*")
    .eq("customer_id", customerId)
    .eq("is_sent", false)
    .lte("scheduled_at", new Date().toISOString())
    .order("urgency", { ascending: false }) // "high" before "info"
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAllAlerts(customerId: string): Promise<AiAlert[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_alerts")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function dismissAlert(alertId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ai_alerts")
    .update({ is_sent: true, sent_at: new Date().toISOString() })
    .eq("id", alertId);

  if (error) throw error;
}
