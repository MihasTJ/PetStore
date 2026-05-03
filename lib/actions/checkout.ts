"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPayuOrder } from "@/lib/payu/client";
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
    .select("id, price_sell, name_seo")
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

  const priceMap = new Map(products.map((p) => [p.id, p.price_sell]));

  const deliveryGrosze = DELIVERY_GROSZE[data.delivery];
  const packagingGrosze = data.premiumPackaging ? 1900 : 0;
  const productsGrosze = data.items.reduce(
    (sum, item) =>
      sum + Math.round((priceMap.get(item.id) ?? 0) * 100) * item.quantity,
    0
  );
  const totalGrosze = productsGrosze + deliveryGrosze + packagingGrosze;

  // INSERT order — RLS policy: with_check (true), anon key works fine
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
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
        street: data.street,
        apt: data.apt || null,
        postal_code: data.postalCode,
        city: data.city,
      },
      premium_packaging: data.premiumPackaging,
      packaging_note: data.packagingNote || null,
      nip: data.nip || null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[checkout] Order insert error:", orderError);
    return { error: "Nie udało się zapisać zamówienia. Spróbuj ponownie." };
  }

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

  // Build absolute URLs for PayU callbacks
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${proto}://${host}`;
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

  try {
    const payuOrder = await createPayuOrder({
      notifyUrl: `${origin}/api/payu/webhook`,
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
      continueUrl: `${origin}/checkout/potwierdzenie?order_id=${order.id}`,
    });

    // UPDATE payment_id — RLS blocks anon UPDATE, so admin client is needed here
    // Non-fatal: webhook matches by extOrderId (our DB UUID) as primary key anyway
    try {
      const admin = createAdminClient();
      await admin
        .from("orders")
        .update({ payment_id: payuOrder.orderId })
        .eq("id", order.id);
    } catch (updateErr) {
      console.error("[checkout] payment_id update failed (non-fatal):", updateErr);
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
