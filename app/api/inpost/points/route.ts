import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

type InpostPoint = {
  name: string;
  address: { line1: string; city: string; post_code: string };
  location: { latitude: number; longitude: number };
};

// Loaded once on first request — stays in Node.js module memory.
let _dataset: InpostPoint[] | null = null;
function getDataset(): InpostPoint[] {
  if (_dataset) return _dataset;
  const raw = readFileSync(
    join(process.cwd(), "lib", "data", "inpost-points.json"),
    "utf-8"
  );
  _dataset = (JSON.parse(raw) as { points: InpostPoint[] }).points;
  return _dataset;
}

// City → coordinates cache (per-process, avoids repeat Nominatim calls)
const geoCache = new Map<string, { lat: number; lon: number }>();

async function geocode(city: string): Promise<{ lat: number; lon: number } | null> {
  const key = city.toLowerCase().trim();
  if (geoCache.has(key)) return geoCache.get(key)!;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(city)}&countrycodes=pl&format=json&limit=1`,
      {
        headers: { "User-Agent": "pet-store-checkout/1.0 (nobilepetcare.pl)" },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data[0]) return null;
    const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    geoCache.set(key, coords);
    return coords;
  } catch {
    return null;
  }
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const city = searchParams.get("city");
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  let lat: number;
  let lon: number;
  let searchedCity = "";

  if (latParam && lngParam) {
    lat = parseFloat(latParam);
    lon = parseFloat(lngParam);
  } else if (city) {
    searchedCity = city;
    const coords = await geocode(city);
    if (!coords) {
      return NextResponse.json(
        { error: `Nie znaleziono miasta: ${city}` },
        { status: 404 }
      );
    }
    lat = coords.lat;
    lon = coords.lon;
  } else {
    return NextResponse.json({ error: "Podaj city lub lat/lng" }, { status: 400 });
  }

  const radiusKm = latParam ? 5 : 10;
  const all = getDataset();

  // Valid InPost codes: 2-7 uppercase letters + 1-4 digits + optional letter (e.g. WAR010M, KRA42N)
  const validCode = /^[A-Z]{2,7}\d{1,4}[A-Z]?$/;

  const items = all
    .filter(
      (p) =>
        validCode.test(p.name) &&
        distanceKm(lat, lon, p.location.latitude, p.location.longitude) <= radiusKm
    )
    .map((p) => {
      const dist = distanceKm(lat, lon, p.location.latitude, p.location.longitude);
      // Fill in missing city from the search term (all results are already near that city)
      const city = p.address.city || searchedCity;
      return { ...p, address: { ...p.address, city }, _dist: dist };
    })
    .sort((a, b) => a._dist - b._dist)
    .map(({ _dist: _, ...p }) => p);

  return NextResponse.json({ items, count: items.length });
}
