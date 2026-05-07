import { NextRequest, NextResponse } from "next/server";
import { verifyPayuSignature } from "@/lib/payu/client";
import type { PayuNotification, PayuOrderStatus } from "@/lib/payu/types";
import { resend, FROM } from "@/lib/email/client";
import {
  orderConfirmationHtml,
  orderConfirmationText,
  type OrderEmailData,
} from "@/lib/email/order-confirmation";

type OrderStatus = "pending" | "paid" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed";

const ORDER_STATUS: Record<PayuOrderStatus, OrderStatus> = {
  PENDING: "pending",
  WAITING_FOR_CONFIRMATION: "pending",
  COMPLETED: "paid",
  CANCELED: "cancelled",
  REJECTED: "cancelled",
};

const PAYMENT_STATUS: Record<PayuOrderStatus, PaymentStatus> = {
  PENDING: "pending",
  WAITING_FOR_CONFIRMATION: "pending",
  COMPLETED: "paid",
  CANCELED: "failed",
  REJECTED: "failed",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sigHeader = req.headers.get("OpenPayU-Signature") ?? "";

  if (!verifyPayuSignature(body, sigHeader)) {
    return NextResponse.json({ message: "invalid signature" }, { status: 401 });
  }

  let notification: PayuNotification;
  try {
    notification = JSON.parse(body) as PayuNotification;
  } catch {
    return NextResponse.json({ message: "invalid json" }, { status: 400 });
  }

  const { order } = notification;
  if (!order) {
    return NextResponse.json({ message: "missing order" }, { status: 400 });
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const orderStatus = ORDER_STATUS[order.status] ?? "pending";
  const paymentStatus = PAYMENT_STATUS[order.status] ?? "pending";

  const orderId = order.extOrderId ?? null;
  const { error } = orderId
    ? await supabase.rpc("update_order_payment", {
        p_order_id: orderId,
        p_payu_id: order.orderId,
        p_order_status: orderStatus,
        p_payment_status: paymentStatus,
      })
    : await supabase
        .from("orders")
        .update({ status: orderStatus, payment_status: paymentStatus })
        .eq("payment_id", order.orderId);

  if (error) {
    console.error("Webhook DB update error:", error);
    return NextResponse.json({ message: "db error" }, { status: 500 });
  }

  // Send confirmation email only on successful payment
  if (paymentStatus === "paid" && orderId) {
    try {
      // mark_confirmation_email_sent returns true only the first time (prevents duplicates)
      const { data: sentRows } = await supabase.rpc(
        "mark_confirmation_email_sent",
        { p_order_id: orderId }
      );

      const shouldSend = Array.isArray(sentRows)
        ? sentRows[0]?.sent === true
        : (sentRows as { sent?: boolean } | null)?.sent === true;

      if (shouldSend) {
        const { data: details } = await supabase.rpc(
          "get_order_details_for_email",
          { p_order_id: orderId }
        );

        if (details) {
          const d = details as Record<string, unknown>;
          const addr = d.shipping_address as Record<string, string>;
          const petName = typeof d.pet_name === "string" && d.pet_name.trim()
            ? d.pet_name.trim()
            : null;
          const emailData: OrderEmailData = {
            orderNumber: orderId.slice(0, 8).toUpperCase(),
            firstName: addr.first_name ?? "Kliencie",
            petName,
            items: (d.items as OrderEmailData["items"]) ?? [],
            shippingCost: Number(d.shipping_cost),
            premiumPackaging: (d.premium_packaging as boolean) ?? false,
            total: Number(d.total_amount),
            shippingAddress: {
              first_name: addr.first_name,
              last_name: addr.last_name,
              street: addr.street,
              apt: addr.apt ?? null,
              postal_code: addr.postal_code,
              city: addr.city,
            },
            shippingMethod:
              d.shipping_method === "dpd" ? "dpd" : "inpost",
          };

          await resend.emails.send({
            from: FROM,
            to: addr.email,
            subject: `Doskonały wybór dla ${petName ?? "Twojego pupila"} — zamówienie #${emailData.orderNumber}`,
            html: orderConfirmationHtml(emailData),
            text: orderConfirmationText(emailData),
          });
        }
      }
    } catch (emailErr) {
      // Email failure must not fail the webhook response — PayU would retry
      console.error("Confirmation email error:", emailErr);
    }
  }

  return NextResponse.json({ status: "OK" });
}
