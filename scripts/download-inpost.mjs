/**
 * Downloads all InPost parcel lockers in Poland.
 *
 * Priority:
 *   1. InPost API (set INPOST_TOKEN env var) — kompletne adresy, najlepsza jakość
 *   2. OpenStreetMap Overpass API         — darmowe, bez klucza, fallback
 *
 * Run:              node scripts/download-inpost.mjs
 * With InPost API:  INPOST_TOKEN=xxx node scripts/download-inpost.mjs
 * Output:           lib/data/inpost-points.json
 *
 * Refreshed automatically every Sunday via GitHub Actions.
 * INPOST_TOKEN is optional — register free at manager.inpost.pl → Integracje → API
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "lib", "data", "inpost-points.json");

// ─── InPost API ───────────────────────────────────────────────────────────────

async function downloadFromInpost(token) {
  console.log("\nPobieranie z InPost API...");
  const all = [];
  let page = 1;

  while (true) {
    const url =
      `https://api.inpost.pl/v1/points` +
      `?type=parcel_locker&per_page=5000&page=${page}` +
      `&fields=name,address_details,location,functions`;

    let res;
    try {
      res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "User-Agent": "pet-store-download/1.0 (nobilepetcare.pl)",
        },
        signal: AbortSignal.timeout(60_000),
      });
    } catch (e) {
      console.error(`  Błąd połączenia: ${e.message}`);
      return null;
    }

    if (!res.ok) {
      console.error(`  HTTP ${res.status} — sprawdź INPOST_TOKEN`);
      return null;
    }

    let data;
    try {
      data = await res.json();
    } catch {
      console.error("  Błąd parsowania JSON z InPost API");
      return null;
    }

    const items = data.items ?? data.points ?? [];
    if (items.length === 0) break;
    all.push(...items);
    console.log(`  Strona ${page}: ${items.length} punktów (łącznie: ${all.length})`);

    const total = data.total_count ?? data.count ?? Infinity;
    if (all.length >= total) break;
    page++;
  }

  if (all.length === 0) {
    console.error("  API zwróciło 0 punktów");
    return null;
  }

  console.log(`\nRazem z InPost API: ${all.length} paczkomatów`);
  return all.map(mapInpostPoint);
}

function mapInpostPoint(item) {
  const a = item.address_details ?? {};

  // Wiejskie adresy PL: brak ulicy, jest tylko numer domu ("320")
  // InPost zwraca wtedy street="" i building_number="Trzciana 320" lub street="Trzciana" building_number="320"
  let line1;
  if (a.street) {
    line1 = [a.street, a.building_number].filter(Boolean).join(" ").trim();
  } else if (a.building_number) {
    // Numer może już zawierać nazwę miejscowości (np. "Trzciana 320")
    line1 = a.building_number.trim();
  } else {
    line1 = "—";
  }

  return {
    name: (item.name ?? "").trim(),
    address: {
      line1,
      city: (a.city ?? "").trim(),
      post_code: (a.post_code ?? "").trim(),
    },
    location: {
      latitude: item.location?.latitude ?? 0,
      longitude: item.location?.longitude ?? 0,
    },
  };
}

// ─── OpenStreetMap (Overpass) ─────────────────────────────────────────────────

const BBOX = "49.0,14.1,54.9,24.2";

const QUERY = `[out:json][timeout:120];
(
  node["amenity"="parcel_locker"]["brand"~"InPost",i](${BBOX});
  node["amenity"="parcel_locker"]["operator"~"InPost",i](${BBOX});
);
out body;`;

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const OSM_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "application/json, text/plain, */*",
  "User-Agent": "pet-store-download/1.0 (nobilepetcare.pl)",
};

function parseAddressFromUrl(website, ref) {
  try {
    const path = new URL(website).pathname;
    const core = path.replace(/^\/paczkomat-/, "");
    const refLower = ref.toLowerCase();
    const idx = core.indexOf(refLower);
    if (idx < 0) return { city: "", street: "" };
    const citySlug = core.slice(0, idx).replace(/-$/, "");
    const afterRef = core.slice(idx + refLower.length).replace(/^-/, "");
    const streetSlug = afterRef.split("-paczkomaty-")[0];
    const toTitle = (s) =>
      s
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    return { city: toTitle(citySlug), street: toTitle(streetSlug) };
  } catch {
    return { city: "", street: "" };
  }
}

async function downloadFromOSM() {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    console.log(`\nPróbuję: ${endpoint}`);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: OSM_HEADERS,
        body: `data=${encodeURIComponent(QUERY)}`,
        signal: AbortSignal.timeout(150_000),
      });
      if (!res.ok) {
        console.error(`  HTTP ${res.status} — próbuję następny`);
        continue;
      }
      console.log("  Pobieranie danych...");
      const data = await res.json();
      return data.elements ?? [];
    } catch (e) {
      console.error(`  Błąd: ${e.message} — próbuję następny`);
    }
  }
  throw new Error("Wszystkie endpointy Overpass zawiodły");
}

function mapOsmElement(el) {
  const t = el.tags ?? {};
  const ref = (t["ref"] ?? t["name"] ?? String(el.id)).trim();

  let street = [t["addr:street"], t["addr:housenumber"]]
    .filter(Boolean)
    .join(" ");
  let city = (t["addr:city"] ?? t["addr:place"] ?? "").trim();

  // Wiejski adres PL: brak nazwy ulicy, jest addr:place + addr:housenumber
  // np. addr:place=Trzciana + addr:housenumber=320 → "Trzciana 320"
  if (!street && t["addr:place"] && t["addr:housenumber"]) {
    street = `${t["addr:place"]} ${t["addr:housenumber"]}`;
    if (!city) city = t["addr:place"];
  }

  // Fallback: parsuj adres z URL strony InPost
  if (!street) {
    const website = t["website:pl"] ?? t["website"] ?? "";
    if (website) {
      const parsed = parseAddressFromUrl(website, ref);
      street = parsed.street;
      if (!city) city = parsed.city;
    }
  }

  // Ostatni fallback: tag description (np. "Przy sklepie Stanex")
  if (!street && t["description"]) street = t["description"];

  return {
    name: ref,
    address: {
      line1: street || "—",
      city,
      post_code: (t["addr:postcode"] ?? "").trim(),
    },
    location: { latitude: el.lat, longitude: el.lon },
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const token = process.env.INPOST_TOKEN?.trim();
let points;
let source;

if (token) {
  const inpostPoints = await downloadFromInpost(token);
  if (inpostPoints) {
    points = inpostPoints;
    source = "inpost-api";
  } else {
    console.log("\nFallback: używam OpenStreetMap...");
    const elements = await downloadFromOSM();
    console.log(`Pobrano ${elements.length} elementów z OSM`);
    points = elements.map(mapOsmElement);
    source = "openstreetmap";
  }
} else {
  console.log("Brak INPOST_TOKEN — używam OpenStreetMap (fallback)");
  console.log(
    "Tip: Zarejestruj się na manager.inpost.pl → dostaniesz token z kompletnymi adresami\n"
  );
  const elements = await downloadFromOSM();
  console.log(`\nPobrano ${elements.length} elementów z OSM`);
  points = elements.map(mapOsmElement);
  source = "openstreetmap";
}

// Deduplikacja i sortowanie
const seen = new Set();
const unique = points
  .filter((p) => {
    if (!p.name || seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Statystyki jakości adresów
const withAddress = unique.filter((p) => p.address.line1 !== "—").length;
const pct = Math.round((withAddress / unique.length) * 100);
console.log(`\nUnikalne paczkomaty: ${unique.length}`);
console.log(`Pokrycie adresów: ${withAddress} / ${unique.length} (${pct}%)`);

mkdirSync(join(__dirname, "..", "lib", "data"), { recursive: true });
const output = {
  generated: new Date().toISOString(),
  source,
  count: unique.length,
  points: unique,
};
writeFileSync(OUT, JSON.stringify(output), "utf-8");

const sizeKB = Math.round(Buffer.byteLength(JSON.stringify(output)) / 1024);
console.log(`\nZapisano → lib/data/inpost-points.json (${sizeKB} KB)`);
console.log("Gotowe. Dane odświeżane automatycznie co niedzielę przez GitHub Actions.");
