"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type DashboardStats = {
  sales7d: number;
  ordersCount7d: number;
  salesSparkline: number[];
  quizConversionPct: number;
  quizConversionDelta: number;
  quizSparkline: number[];
  petProfilesTotal: number;
  petProfilesNewThisWeek: number;
  petSparkline: number[];
  alertsSent: number;
  alertsSparkline: number[];
};

function bucketByDay(
  items: Array<{ ts: string; value?: number }>,
  days: number,
  now: Date
): number[] {
  const buckets = new Array(days).fill(0);
  const cutoffMs = now.getTime() - days * 24 * 60 * 60 * 1000;
  for (const item of items) {
    const dMs = new Date(item.ts).getTime();
    const idx = Math.floor((dMs - cutoffMs) / (24 * 60 * 60 * 1000));
    if (idx >= 0 && idx < days) {
      buckets[idx] += item.value ?? 1;
    }
  }
  return buckets;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();
  const now = new Date();
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

  const cutoff7d = daysAgo(7);
  const cutoff14d = daysAgo(14);

  // ── Orders ───────────────────────────────────────────────────────────
  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", cutoff14d)
    .in("status", ["paid", "processing", "shipped", "delivered"]);

  const validOrders = orders ?? [];
  const orders7d = validOrders.filter((o) => o.created_at >= cutoff7d);

  const sales7d = orders7d.reduce((s, o) => s + Number(o.total_amount), 0);

  const salesSparkline = bucketByDay(
    validOrders.map((o) => ({ ts: o.created_at, value: Number(o.total_amount) })),
    14,
    now
  );

  // ── Health reports (quiz) ─────────────────────────────────────────────
  const { data: reports } = await supabase
    .from("health_reports")
    .select("created_at, order_id")
    .gte("created_at", cutoff14d);

  const allReports = reports ?? [];
  const reports7d = allReports.filter((r) => r.created_at >= cutoff7d);
  const reportsPrev = allReports.filter(
    (r) => r.created_at >= cutoff14d && r.created_at < cutoff7d
  );

  const quiz7dTotal = reports7d.length;
  const quiz7dWithOrder = reports7d.filter((r) => r.order_id != null).length;
  const quizConversionPct =
    quiz7dTotal > 0 ? (quiz7dWithOrder / quiz7dTotal) * 100 : 0;

  const prevTotal = reportsPrev.length;
  const prevWithOrder = reportsPrev.filter((r) => r.order_id != null).length;
  const prevPct = prevTotal > 0 ? (prevWithOrder / prevTotal) * 100 : 0;
  const quizConversionDelta = quizConversionPct - prevPct;

  const quizSparkline = bucketByDay(
    allReports.map((r) => ({ ts: r.created_at })),
    15,
    now
  );

  // ── Pet profiles ──────────────────────────────────────────────────────
  const [{ count: petTotal }, { count: petNew }, { data: petSparkData }] =
    await Promise.all([
      supabase
        .from("pet_profiles")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("pet_profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", cutoff7d),
      supabase
        .from("pet_profiles")
        .select("created_at")
        .gte("created_at", cutoff14d),
    ]);

  const petSparkline = bucketByDay(
    (petSparkData ?? []).map((p) => ({ ts: p.created_at })),
    15,
    now
  );

  // ── AI alerts ─────────────────────────────────────────────────────────
  const { data: alertsData } = await supabase
    .from("ai_alerts")
    .select("created_at, is_sent, sent_at")
    .gte("created_at", daysAgo(30));

  const sentAlerts = (alertsData ?? []).filter((a) => a.is_sent);
  const alertsSparkline = bucketByDay(
    sentAlerts.map((a) => ({ ts: a.sent_at ?? a.created_at })),
    15,
    now
  );

  return {
    sales7d,
    ordersCount7d: orders7d.length,
    salesSparkline,
    quizConversionPct,
    quizConversionDelta,
    quizSparkline,
    petProfilesTotal: petTotal ?? 0,
    petProfilesNewThisWeek: petNew ?? 0,
    petSparkline,
    alertsSent: sentAlerts.length,
    alertsSparkline,
  };
}
