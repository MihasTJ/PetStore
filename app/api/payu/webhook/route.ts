import { NextRequest, NextResponse } from "next/server";
import { verifyPayuSignature } from "@/lib/payu/client";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PayuNotification, PayuOrderStatus } from "@/lib/payu/types";

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

  const admin = createAdminClient();
  const orderStatus = ORDER_STATUS[order.status] ?? "pending";
  const paymentStatus = PAYMENT_STATUS[order.status] ?? "pending";

  // Match by our DB UUID (extOrderId) if available, else fall back to PayU's orderId
  const { error } = order.extOrderId
    ? await admin
        .from("orders")
        .update({ status: orderStatus, payment_status: paymentStatus })
        .eq("id", order.extOrderId)
    : await admin
        .from("orders")
        .update({ status: orderStatus, payment_status: paymentStatus })
        .eq("payment_id", order.orderId);

  if (error) {
    console.error("Webhook DB update error:", error);
    // Return 500 so PayU retries the notification
    return NextResponse.json({ message: "db error" }, { status: 500 });
  }

  return NextResponse.json({ status: "OK" });
}
