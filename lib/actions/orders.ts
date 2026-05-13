"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createPayuRefund, getPayuOrderRefunds } from "@/lib/payu/client";

export async function initiatePayuRefund(orderId: string): Promise<{ error?: string; syncedFromPayu?: boolean }> {
  const supabase = createAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("payment_id, status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { error: "Nie znaleziono zamówienia." };
  }
  if (order.status === "refunded") {
    return { error: "Zamówienie jest już oznaczone jako zwrot." };
  }
  if (!order.payment_id) {
    return { error: "Brak ID transakcji PayU — nie można zainicjować zwrotu przez API." };
  }

  // Check PayU for an existing FINALIZED refund — handles case where refund was done via
  // PayU panel but our webhook wasn't received (wrong notifyUrl, transient error, etc.)
  const existingRefund = await getPayuOrderRefunds(order.payment_id).catch(() => null);
  if (existingRefund === "FINALIZED") {
    const { error: syncError } = await supabase
      .from("orders")
      .update({ status: "refunded", payment_status: "refunded" })
      .eq("id", orderId);
    if (syncError) {
      console.error("[admin] refund sync DB error:", syncError);
      return { error: "Błąd synchronizacji bazy: " + syncError.message };
    }
    return { syncedFromPayu: true };
  }

  // No existing finalized refund — initiate one via PayU API
  const result = await createPayuRefund(order.payment_id);
  if (!result.success) {
    return { error: result.error ?? "Błąd API PayU." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "refunded", payment_status: "refunded" })
    .eq("id", orderId);

  if (updateError) {
    console.error("[admin] initiatePayuRefund DB update error:", updateError);
    return { error: "Zwrot zainicjowany w PayU, ale błąd aktualizacji bazy: " + updateError.message };
  }

  return {};
}

// Checks all currently-paid orders against PayU refunds API and syncs DB.
// Called on every admin panel poll so refunds from PayU panel show up automatically
// even when the PayU webhook was missed (wrong notifyUrl, transient failure, etc.).
export async function syncPaidOrdersFromPayU(): Promise<void> {
  const supabase = createAdminClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: paidOrders } = await supabase
    .from("orders")
    .select("id, payment_id")
    .eq("status", "paid")
    .not("payment_id", "is", null)
    .gte("created_at", thirtyDaysAgo)
    .limit(20);

  if (!paidOrders?.length) return;

  await Promise.allSettled(
    paidOrders.map(async (order) => {
      const refundStatus = await getPayuOrderRefunds(order.payment_id!).catch(() => null);
      if (refundStatus === "FINALIZED") {
        await supabase
          .from("orders")
          .update({ status: "refunded", payment_status: "refunded" })
          .eq("id", order.id);
      }
    })
  );
}

export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type AdminOrder = {
  id: string;
  shortId: string;
  customerName: string;
  customerEmail: string;
  petName: string;
  itemsCount: number;
  status: AdminOrderStatus;
  paymentStatus: string;
  paymentId: string | null;
  totalAmount: number;
  shippingMethod: string;
  paczkomatName: string | null;
  premiumPackaging: boolean;
  packagingNote: string | null;
  createdAt: string;
};

export type AdminOrderItem = {
  id: string;
  productName: string;
  productSlug: string | null;
  quantity: number;
  priceAtPurchase: number;
};

export type AdminOrderDetail = AdminOrder & {
  items: AdminOrderItem[];
  shippingCost: number;
  nip: string | null;
  shippingAddress: {
    email: string;
    first_name: string;
    last_name: string;
    street: string | null;
    apt: string | null;
    postal_code: string | null;
    city: string | null;
    point_name: string | null;
  };
};

export async function getOrderDetail(orderId: string): Promise<AdminOrderDetail | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, status, payment_status, payment_id,
      total_amount, shipping_method, shipping_cost, shipping_address,
      premium_packaging, packaging_note, pet_name, created_at, nip,
      order_items(id, quantity, price_at_purchase, product_snapshot, products(slug))
    `)
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  const addr = (data.shipping_address ?? {}) as Record<string, string | null>;
  const firstName = addr.first_name ?? "";
  const lastName = addr.last_name ?? "";
  const customerEmail = addr.email ?? "";
  const customerName = [firstName, lastName].filter(Boolean).join(" ") || customerEmail || "Gość";

  const rawItems = (data.order_items ?? []) as Array<{
    id: string;
    quantity: number;
    price_at_purchase: number;
    product_snapshot: Record<string, unknown>;
    products: { slug: string } | null;
  }>;

  const items: AdminOrderItem[] = rawItems.map((item) => ({
    id: item.id,
    productName: (item.product_snapshot?.name as string) ?? "—",
    productSlug: item.products?.slug ?? null,
    quantity: item.quantity,
    priceAtPurchase: item.price_at_purchase,
  }));

  const row = data as Record<string, unknown>;

  return {
    id: data.id,
    shortId: data.id.slice(0, 8).toUpperCase(),
    customerName,
    customerEmail,
    petName: data.pet_name ?? "—",
    itemsCount: items.length,
    status: data.status as AdminOrderStatus,
    paymentStatus: data.payment_status,
    paymentId: data.payment_id ?? null,
    totalAmount: data.total_amount,
    shippingMethod: data.shipping_method,
    paczkomatName: addr.point_name ?? null,
    premiumPackaging: data.premium_packaging,
    packagingNote: data.packaging_note ?? null,
    createdAt: data.created_at,
    items,
    shippingCost: (row.shipping_cost as number) ?? 0,
    nip: (row.nip as string | null) ?? null,
    shippingAddress: {
      email: customerEmail,
      first_name: firstName,
      last_name: lastName,
      street: addr.street ?? null,
      apt: addr.apt ?? null,
      postal_code: addr.postal_code ?? null,
      city: addr.city ?? null,
      point_name: addr.point_name ?? null,
    },
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: AdminOrderStatus
): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) {
    console.error("[admin] updateOrderStatus error:", error);
    return { error: error.message };
  }
  return {};
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      payment_status,
      payment_id,
      total_amount,
      shipping_method,
      shipping_address,
      premium_packaging,
      packaging_note,
      pet_name,
      created_at,
      order_items(id)
    `)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[admin] Orders fetch error:", error);
    return [];
  }

  return (data ?? []).map((o) => {
    const addr = o.shipping_address as Record<string, string | null>;
    const firstName = addr?.first_name ?? "";
    const lastName = addr?.last_name ?? "";
    const customerEmail = addr?.email ?? "";
    const customerName =
      [firstName, lastName].filter(Boolean).join(" ") || customerEmail || "Gość";

    return {
      id: o.id,
      shortId: o.id.slice(0, 8).toUpperCase(),
      customerName,
      customerEmail,
      petName: o.pet_name ?? "—",
      itemsCount: Array.isArray(o.order_items) ? o.order_items.length : 0,
      status: o.status as AdminOrderStatus,
      paymentStatus: o.payment_status,
      paymentId: o.payment_id ?? null,
      totalAmount: o.total_amount,
      shippingMethod: o.shipping_method,
      paczkomatName: addr?.point_name ?? null,
      premiumPackaging: o.premium_packaging,
      packagingNote: o.packaging_note ?? null,
      createdAt: o.created_at,
    };
  });
}
