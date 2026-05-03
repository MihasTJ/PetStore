import { createHash } from "crypto";
import type { PayuOrderRequest, PayuOrderResponse } from "./types";

const PAYU_BASE =
  process.env.PAYU_SANDBOX === "true"
    ? "https://secure.snd.payu.com"
    : "https://secure.payu.com";

// Module-level token cache — persists across requests in the same server instance
let tokenCache: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.value;

  const res = await fetch(`${PAYU_BASE}/pl/standard/user/oauth/authorize`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.PAYU_CLIENT_ID!,
      client_secret: process.env.PAYU_CLIENT_SECRET!,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayU auth failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  tokenCache = {
    value: json.access_token as string,
    expiresAt: Date.now() + ((json.expires_in as number) - 60) * 1000,
  };
  return tokenCache.value;
}

export async function createPayuOrder(
  order: PayuOrderRequest
): Promise<PayuOrderResponse> {
  const token = await getToken();

  // PayU returns 302 with JSON body — disable auto-redirect to read the body
  const res = await fetch(`${PAYU_BASE}/api/v2_1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
    redirect: "manual",
    cache: "no-store",
  });

  if (res.status === 302 || res.ok) {
    return res.json() as Promise<PayuOrderResponse>;
  }

  const text = await res.text();
  throw new Error(`PayU createOrder failed (${res.status}): ${text}`);
}

// Validates the OpenPayU-Signature header sent with PayU webhooks.
// Format: "algorithm=MD5;signature=HASH;sender=SENDER"
export function verifyPayuSignature(body: string, header: string): boolean {
  if (!header) return false;

  const parts = Object.fromEntries(
    header.split(";").map((part) => {
      const idx = part.indexOf("=");
      return [part.slice(0, idx), part.slice(idx + 1)] as [string, string];
    })
  );

  const expected = createHash("md5")
    .update(body + process.env.PAYU_SECOND_KEY!)
    .digest("hex");

  return parts.signature === expected;
}
