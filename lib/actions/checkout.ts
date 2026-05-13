"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPayuOrder, getPayuOrderStatus } from "@/lib/payu/client";
import type { CartItem } from "@/lib/cart";

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  apt: string;
  postalCode: string;
  city: string;
  nip: string;
  delivery: "inpost" | "dpd";
  premiumPackaging: boolean;
  packagingNote: string;
  petName?: string;
  inpostPoint?: { name: string; address: string; city: string };
  items: Pick<CartItem, "id" | "name" | "price" | "quantity">[];
}

const DELIVERY_GROSZE: Record<"inpost" | "dpd", number> = {
  inpost: 1399,
  dpd: 1499,
};

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createOrder(
  data: CheckoutFormData
): Promise<{ redirectUrl: string } | { error: string }> {
  // SSR client (anon key + cookies) — sufficient for public SELECT and open INSERT policies
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guard: all cart IDs must be valid UUIDs (products.id is uuid in Postgres)
  const productIds = data.items.map((i) => i.id);
  const invalidIds = productIds.filter((id) => !uuidRegex.test(id));
  if (invalidIds.length > 0) {
    console.error("[checkout] Non-UUID product IDs:", invalidIds);
    return {
      error:
        "Nieprawidłowe ID produktu w koszyku. Wyczyść koszyk i dodaj produkt ponownie.",
    };
  }

  // SELECT products — RLS policy: using (true), anon key works fine
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price_sell, name_seo, stock")
    .in("id", productIds)
    .eq("is_active", true);

  if (productsError) {
    console.error("[checkout] Products query error:", productsError);
    return {
      error: "Błąd bazy danych podczas weryfikacji produktów. Spróbuj ponownie.",
    };
  }

  if (!products || products.length !== data.items.length) {
    const foundIds = new Set(products?.map((p) => p.id) ?? []);
    const missing = productIds.filter((id) => !foundIds.has(id));
    console.error("[checkout] Missing/inactive products:", missing);
    return {
      error:
        "Jeden lub więcej produktów jest niedostępnych. Odśwież koszyk i spróbuj ponownie.",
    };
  }

  const stockMap = new Map(products.map((p) => [p.id, p.stock]));
  const overStock = data.items.filter((item) => item.quantity > (stockMap.get(item.id) ?? 0));
  if (overStock.length > 0) {
    const names = overStock.map((i) => products.find((p) => p.id === i.id)?.name_seo ?? i.id).join(", ");
    console.error("[checkout] Requested quantity exceeds stock:", overStock);
    return {
      error: `Niewystarczający stan magazynowy: ${names}. Zmniejsz ilość i spróbuj ponownie.`,
    };
  }

  const priceMap = new Map(products.map((p) => [p.id, p.price_sell]));

  const deliveryGrosze = DELIVERY_GROSZE[data.delivery];
  const packagingGrosze = data.premiumPackaging ? 1900 : 0;
  const productsGrosze = data.items.reduce(
    (sum, item) =>
      sum + Math.round((priceMap.get(item.id) ?? 0) * 100) * item.quantity,
    0
  );
  const totalGrosze = productsGrosze + deliveryGrosze + packagingGrosze;

  // If petName wasn't passed (user skipped quiz), fall back to their saved pet profile
  let resolvedPetName = data.petName?.trim() || null;
  if (!resolvedPetName && user) {
    const { data: petProfile } = await supabase
      .from("pet_profiles")
      .select("pet_name")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (petProfile?.pet_name) resolvedPetName = petProfile.pet_name;
  }

  // Pre-generate order UUID so we don't need SELECT after INSERT.
  // orders_select policy requires auth.uid() = customer_id — for guests both are
  // NULL, and NULL = NULL is NULL (falsy) in Postgres, so chaining .select("id")
  // on an anon insert returns nothing and breaks guest checkout.
  const orderId = randomUUID();

  // INSERT order — RLS policy: with_check (true), anon key works fine
  const { error: orderError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      customer_id: user?.id ?? null,
      status: "pending",
      payment_status: "pending",
      total_amount: totalGrosze / 100,
      shipping_method: data.delivery,
      shipping_cost: deliveryGrosze / 100,
      shipping_address: {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        ...(data.delivery === "inpost" && data.inpostPoint
          ? {
              point_name: data.inpostPoint.name,
              street: data.inpostPoint.address,
              city: data.inpostPoint.city,
              apt: null,
              postal_code: null,
            }
          : {
              street: data.street,
              apt: data.apt || null,
              postal_code: data.postalCode,
              city: data.city,
            }),
      },
      premium_packaging: data.premiumPackaging,
      packaging_note: data.packagingNote || null,
      nip: data.nip || null,
      pet_name: resolvedPetName,
    });

  if (orderError) {
    console.error("[checkout] Order insert error:", orderError);
    return { error: "Nie udało się zapisać zamówienia. Spróbuj ponownie." };
  }

  const order = { id: orderId };

  // INSERT order_items — RLS policy: with_check (true), anon key works fine
  const { error: itemsError } = await supabase.from("order_items").insert(
    data.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: priceMap.get(item.id) ?? item.price,
      product_snapshot: {
        name: item.name,
        price: priceMap.get(item.id) ?? item.price,
      },
    }))
  );

  if (itemsError) {
    console.error("[checkout] Order items error:", itemsError);
    return {
      error: "Błąd przy zapisywaniu pozycji zamówienia. Skontaktuj się z obsługą.",
    };
  }

  // Atomically reserve stock — uses FOR UPDATE locks, serializes concurrent checkouts
  const adminSupabase = createAdminClient();
  const { data: reserveData, error: reserveError } = await adminSupabase.rpc(
    "reserve_order_stock",
    { p_order_id: order.id }
  );

  const reserved = !reserveError && (reserveData as { ok?: boolean } | null)?.ok === true;
  if (!reserved) {
    console.error("[checkout] Stock reservation failed:", reserveError ?? reserveData);
    // order_items cascade-deletes with the order
    await adminSupabase.from("orders").delete().eq("id", order.id);
    return {
      error:
        "Jeden lub więcej produktów nie jest już dostępnych w zamówionej ilości. Odśwież koszyk i spróbuj ponownie.",
    };
  }

  // Build absolute URLs for PayU callbacks
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const localOrigin = `${proto}://${host}`;
  // Webhook must be publicly reachable by PayU — use tunnel URL in dev if set.
  // continueUrl can stay on localhost since it's the user's own browser redirect.
  const webhookOrigin = process.env.PAYU_WEBHOOK_BASE_URL ?? localOrigin;
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

  try {
    const payuOrder = await createPayuOrder({
      notifyUrl: `${webhookOrigin}/api/payu/webhook`,
      customerIp: ip,
      merchantPosId: process.env.PAYU_POS_ID!,
      description: `Zamówienie #${order.id.slice(0, 8).toUpperCase()} — Nobile Pet Care`,
      currencyCode: "PLN",
      totalAmount: String(totalGrosze),
      extOrderId: order.id,
      buyer: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        language: "pl",
      },
      products: [
        ...data.items.map((item) => ({
          name: item.name.slice(0, 255),
          unitPrice: String(
            Math.round((priceMap.get(item.id) ?? item.price) * 100)
          ),
          quantity: String(item.quantity),
        })),
        ...(data.premiumPackaging
          ? [{ name: "Opakowanie premium", unitPrice: "1900", quantity: "1" }]
          : []),
        {
          name:
            data.delivery === "inpost"
              ? "Dostawa InPost Paczkomat"
              : "Dostawa Kurier DPD",
          unitPrice: String(deliveryGrosze),
          quantity: "1",
        },
      ],
      continueUrl: `${localOrigin}/checkout/potwierdzenie?order_id=${order.id}`,
    });

    // UPDATE payment_id via SECURITY DEFINER function — bypasses RLS without service_role
    {
      const { error: updateErr } = await supabase.rpc("update_order_payment", {
        p_order_id: order.id,
        p_payu_id: payuOrder.orderId,
        p_order_status: "pending",
        p_payment_status: "pending",
      });
      if (updateErr) {
        console.error("[checkout] payment_id update failed (non-fatal):", updateErr);
      }
    }

    return { redirectUrl: payuOrder.redirectUri };
  } catch (err) {
    console.error("[checkout] PayU error:", err);
    return {
      error:
        "Nie udało się połączyć z systemem płatności. Spróbuj ponownie lub skontaktuj się z obsługą.",
    };
  }
}

// Called by PendingPoller every 4s: checks PayU API directly and syncs DB.
// Falls back gracefully if PayU is unreachable or payment_id not yet set.
export async function pollOrderStatus(
  orderId: string
): Promise<"pending" | "paid" | "failed"> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select("payment_status, payment_id")
    .eq("id", orderId)
    .single();

  if (!data) return "failed";

  const dbStatus = data.payment_status as string | null;
  if (dbStatus === "paid") return "paid";
  if (dbStatus === "failed") return "failed";

  // Still pending — ask PayU directly
  const paymentId = data.payment_id as string | null;
  if (!paymentId) return "pending";

  const payuStatus = await getPayuOrderStatus(paymentId).catch(() => null);

  if (payuStatus === "COMPLETED") {
    await supabase.rpc("update_order_payment", {
      p_order_id: orderId,
      p_payu_id: paymentId,
      p_order_status: "paid",
      p_payment_status: "paid",
    });
    return "paid";
  }

  if (payuStatus === "CANCELED" || payuStatus === "REJECTED") {
    await supabase.rpc("update_order_payment", {
      p_order_id: orderId,
      p_payu_id: paymentId,
      p_order_status: "cancelled",
      p_payment_status: "failed",
    });
    return "failed";
  }

  return "pending";
}
