"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pollOrderStatus } from "@/lib/actions/checkout";

export function PendingPoller({ orderId }: { orderId: string }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(async () => {
      const status = await pollOrderStatus(orderId);
      if (status !== "pending") {
        router.refresh();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [orderId, router]);

  return null;
}
