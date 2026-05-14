"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type FunnelStage = {
  label: string;
  value: number;
  pct: number;
};

export type RecentOrder = {
  id: string;
  customerName: string;
  petName: string | null;
  status: string;
  amount: number;
  createdAt: string;
  itemsCount: number;
};

export type TrustCertExpiring = {
  productName: string;
  certName: string;
  validUntil: string;
};

export type DashboardStats = {
  sales7d: number;
  ordersCount7d: number;
  salesSparkline: number[];
  quizConversionPct: number;
  quizConversionDelta: number;
  quizSparkline: number[];
  quizCompleted7d: number;
  quizWithOrder7d: number;
  petProfilesTotal: number;
  petProfilesNewThisWeek: number;
  petSparkline: number[];
  alertsSent: number;
  alertsSparkline: number[];
  funnelStages: FunnelStage[];
  avgOrderValue30d: number;
  topPetSpecies: string | null;
  topPetSpeciesPct: number;
  trustProductsTotal: number;
  trustWithEndorsement: number;
  trustWithActiveCert: number;
  trustPremiumVerified: number;
  trustCertsExpiringSoon: TrustCertExpiring[];
  recentOrders: RecentOrder[];
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
  const cutoff30d = daysAgo(30);

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

  // ── Funnel (last 30 days) ─────────────────────────────────────────────
  const [
    { count: newCustomers30d },
    { count: petProfiles30d },
    { count: quizCompleted30d },
    { count: quizWithOrder30d },
    { count: paidOrders30d },
    { data: speciesRows },
    { data: orderAmounts30d },
  ] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", cutoff30d),
    supabase.from("pet_profiles").select("id", { count: "exact", head: true }).gte("created_at", cutoff30d),
    supabase.from("health_reports").select("id", { count: "exact", head: true }).gte("created_at", cutoff30d),
    supabase.from("health_reports").select("id", { count: "exact", head: true }).gte("created_at", cutoff30d).not("order_id", "is", null),
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", cutoff30d).in("status", ["paid", "processing", "shipped", "delivered"]),
    supabase.from("pet_profiles").select("species").gte("created_at", cutoff30d),
    supabase.from("orders").select("total_amount").gte("created_at", cutoff30d).in("status", ["paid", "processing", "shipped", "delivered"]),
  ]);

  const funnelBase = newCustomers30d ?? 0;
  const toPct = (v: number) =>
    funnelBase > 0 ? Math.round((v / funnelBase) * 1000) / 10 : 0;

  const funnelStages: FunnelStage[] = [
    { label: "Nowe konta",        value: funnelBase,               pct: 100 },
    { label: "Profile pupili",    value: petProfiles30d ?? 0,      pct: toPct(petProfiles30d ?? 0) },
    { label: "Quiz ukończony",    value: quizCompleted30d ?? 0,    pct: toPct(quizCompleted30d ?? 0) },
    { label: "Zakup po quizie",   value: quizWithOrder30d ?? 0,    pct: toPct(quizWithOrder30d ?? 0) },
    { label: "Zamówienia płatne", value: paidOrders30d ?? 0,       pct: toPct(paidOrders30d ?? 0) },
  ];

  const speciesCounts: Record<string, number> = {};
  for (const p of speciesRows ?? []) {
    speciesCounts[p.species] = (speciesCounts[p.species] ?? 0) + 1;
  }
  const speciesEntries = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1]);
  const topPetSpecies = speciesEntries[0]?.[0] ?? null;
  const totalSpeciesCount = speciesEntries.reduce((s, [, n]) => s + n, 0);
  const topPetSpeciesPct =
    topPetSpecies && totalSpeciesCount > 0
      ? Math.round((speciesCounts[topPetSpecies] / totalSpeciesCount) * 100)
      : 0;

  const amounts = orderAmounts30d ?? [];
  const avgOrderValue30d =
    amounts.length > 0
      ? amounts.reduce((s, o) => s + Number(o.total_amount), 0) / amounts.length
      : 0;

  // ── Trust signals ─────────────────────────────────────────────────────
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalActiveProductsCount },
    { data: endorsementsRaw },
    { data: allCertsRaw },
    { count: premiumVerifiedCount },
    { data: expiringCertsRaw },
    { data: recentOrdersRaw },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("product_endorsements").select("product_id"),
    supabase.from("product_certificates").select("product_id, valid_until"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_premium_verified", true).eq("is_active", true),
    supabase.from("product_certificates")
      .select("product_id, certificate_name, valid_until, products(name_seo)")
      .gt("valid_until", now.toISOString())
      .lte("valid_until", in30Days)
      .order("valid_until"),
    supabase.from("orders")
      .select("id, created_at, status, total_amount, pet_name, customers(first_name, last_name), order_items(id)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const nowIso = now.toISOString();
  const trustProductsTotal = totalActiveProductsCount ?? 0;
  const trustWithEndorsement = new Set((endorsementsRaw ?? []).map((e) => e.product_id)).size;
  const trustWithActiveCert = new Set(
    (allCertsRaw ?? []).filter((c) => !c.valid_until || c.valid_until > nowIso).map((c) => c.product_id)
  ).size;
  const trustPremiumVerified = premiumVerifiedCount ?? 0;

  type ExpiringCertRow = {
    product_id: string;
    certificate_name: string;
    valid_until: string | null;
    products: { name_seo: string } | null;
  };
  const trustCertsExpiringSoon: TrustCertExpiring[] = ((expiringCertsRaw ?? []) as ExpiringCertRow[]).map((c) => ({
    productName: c.products?.name_seo ?? "—",
    certName: c.certificate_name,
    validUntil: c.valid_until!,
  }));

  type RecentOrderRow = {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    pet_name: string | null;
    customers: { first_name: string | null; last_name: string | null } | null;
    order_items: { id: string }[];
  };
  const recentOrders: RecentOrder[] = ((recentOrdersRaw ?? []) as RecentOrderRow[]).map((o) => ({
    id: o.id,
    customerName: o.customers
      ? [o.customers.first_name, o.customers.last_name].filter(Boolean).join(" ") || "—"
      : "—",
    petName: o.pet_name,
    status: o.status,
    amount: Number(o.total_amount),
    createdAt: o.created_at,
    itemsCount: o.order_items.length,
  }));

  return {
    sales7d,
    ordersCount7d: orders7d.length,
    salesSparkline,
    quizConversionPct,
    quizConversionDelta,
    quizSparkline,
    quizCompleted7d: quiz7dTotal,
    quizWithOrder7d: quiz7dWithOrder,
    petProfilesTotal: petTotal ?? 0,
    petProfilesNewThisWeek: petNew ?? 0,
    petSparkline,
    alertsSent: sentAlerts.length,
    alertsSparkline,
    funnelStages,
    avgOrderValue30d,
    topPetSpecies,
    topPetSpeciesPct,
    trustProductsTotal,
    trustWithEndorsement,
    trustWithActiveCert,
    trustPremiumVerified,
    trustCertsExpiringSoon,
    recentOrders,
  };
}
