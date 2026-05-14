import { ImageResponse } from "next/og"
import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: p } = await supabase
    .from("products")
    .select("name_seo, price_sell, price_promo, is_premium_verified, health_tags, categories(name)")
    .eq("slug", slug)
    .single()

  const name      = p?.name_seo ?? "Premium Pet Care"
  const rawPrice  = p ? (p.price_promo ?? p.price_sell) : null
  const priceFmt  = rawPrice != null ? `${rawPrice.toFixed(2).replace(".", ",")} zł` : null
  const isPremium = p?.is_premium_verified ?? false
  const category  = (p?.categories as unknown as { name: string } | null)?.name ?? null
  const tags      = ((p?.health_tags as string[]) ?? []).slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FAF7F2",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "28px 60px",
            borderBottom: "1px solid rgba(42,42,40,0.08)",
          }}
        >
          <span style={{ fontFamily: "serif", fontSize: 28, color: "#2A2A28", letterSpacing: "-0.02em" }}>
            Nobile
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {isPremium && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(61,79,61,0.09)",
                  padding: "7px 18px",
                  borderRadius: 999,
                }}
              >
                <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#3D4F3D", fontWeight: 700, letterSpacing: "0.06em" }}>
                  ✓ PREMIUM VERIFIED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Main content ───────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "44px 60px 32px",
          }}
        >
          {category && (
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: 13,
                color: "#B8654A",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                margin: "0 0 22px",
              }}
            >
              {category}
            </p>
          )}

          <h1
            style={{
              fontFamily: "serif",
              fontSize: 54,
              color: "#2A2A28",
              lineHeight: 1.1,
              fontWeight: 400,
              margin: 0,
              maxWidth: 820,
            }}
          >
            {name}
          </h1>

          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    background: "rgba(184,101,74,0.09)",
                    padding: "6px 16px",
                    borderRadius: 999,
                  }}
                >
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#B8654A", fontWeight: 600 }}>
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {priceFmt && (
            <p
              style={{
                fontFamily: "serif",
                fontSize: 44,
                color: "#B8654A",
                fontWeight: 400,
                margin: "28px 0 0",
              }}
            >
              {priceFmt}
            </p>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "22px 60px",
            borderTop: "1px solid rgba(42,42,40,0.08)",
          }}
        >
          <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9A9A94" }}>
            nobilepetcare.pl
          </span>
          <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#B8654A" }}>
            Sprawdź zweryfikowany skład →
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
