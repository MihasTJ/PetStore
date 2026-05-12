"use client";

import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Check, Loader2, LocateFixed, MapPin } from "lucide-react";

export type InpostPoint = {
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    post_code: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
};

type Props = {
  selected: InpostPoint | null;
  onSelect: (point: InpostPoint) => void;
};

// Terracotta and moss mapped to hex for Leaflet circle markers
const COLOR_DEFAULT = "#c1693a";
const COLOR_SELECTED = "#4a7c59";

export function InpostPicker({ selected, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [points, setPoints] = useState<InpostPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Boot Leaflet once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let destroyed = false;
    import("leaflet").then((L) => {
      if (destroyed || !mapContainerRef.current) return;

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: [52.1, 19.4],
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    });

    return () => {
      destroyed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Redraw markers whenever points or selection changes
  useEffect(() => {
    const L = leafletRef.current;
    const markers = markersRef.current;
    if (!L || !markers) return;

    markers.clearLayers();

    points.forEach((point) => {
      const isSelected = selected?.name === point.name;
      const circle = L.circleMarker(
        [point.location.latitude, point.location.longitude],
        {
          radius: isSelected ? 10 : 7,
          fillColor: isSelected ? COLOR_SELECTED : COLOR_DEFAULT,
          color: "#fff",
          weight: 2,
          fillOpacity: 1,
        }
      );

      circle.bindTooltip(
        `<b>${point.name}</b><br/>${point.address.line1}`,
        { direction: "top", offset: [0, -8] }
      );

      circle.on("click", () => onSelect(point));
      markers.addLayer(circle);
    });

    if (points.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(
        points.map((p) => [p.location.latitude, p.location.longitude] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
    }
  }, [points, selected, onSelect]);

  // Scroll selected item into view in the list
  useEffect(() => {
    if (!selected || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-name="${selected.name}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  const fetchPoints = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items: InpostPoint[] = data.items ?? [];
      setPoints(items);
      setSearched(true);
      if (items.length === 0) setError("Brak paczkomaatów dla tej lokalizacji.");
    } catch {
      setError("Nie udało się pobrać listy paczkomaatów. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    fetchPoints(`/api/inpost/points?city=${encodeURIComponent(query.trim())}`);
  }, [query, fetchPoints]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Twoja przeglądarka nie obsługuje geolokalizacji.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchPoints(
          `/api/inpost/points?lat=${coords.latitude}&lng=${coords.longitude}`
        );
        mapRef.current?.setView([coords.latitude, coords.longitude], 13);
      },
      () => {
        setLoading(false);
        setError("Nie udało się pobrać Twojej lokalizacji.");
      },
      { timeout: 8000 }
    );
  }, [fetchPoints]);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            type="text"
            placeholder="Wpisz miasto, np. Warszawa"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-field border border-border-warm bg-card-warm pl-9 pr-3.5 py-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-terracotta focus:shadow-warm-focus transition-shadow"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="rounded-field border border-border-warm bg-card-warm px-4 py-3 text-sm font-medium text-ink hover:border-terracotta/40 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          Szukaj
        </button>

        <button
          type="button"
          onClick={handleLocate}
          disabled={loading}
          title="Znajdź paczkomaty w mojej okolicy"
          className="rounded-field border border-border-warm bg-card-warm px-3.5 py-3 text-ink hover:border-terracotta/40 disabled:opacity-50 transition-colors"
        >
          <LocateFixed size={16} />
        </button>
      </div>

      {/* Map */}
      <div
        className="rounded-card-sm border border-border-warm overflow-hidden"
        style={{ height: 300 }}
      >
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Hint when no search yet */}
      {!searched && !loading && (
        <p className="text-xs text-ink-subtle text-center py-1 flex items-center justify-center gap-1.5">
          <MapPin size={12} />
          Wyszukaj miasto lub użyj przycisku lokalizacji, aby zobaczyć paczkomaty
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-ink-muted">
          <Loader2 size={14} className="animate-spin" />
          Wyszukuję paczkomaty…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-xs text-terracotta">{error}</p>
      )}

      {/* Results list */}
      {!loading && points.length > 0 && (
        <div
          ref={listRef}
          className="max-h-56 overflow-y-auto rounded-card-sm border border-border-warm divide-y divide-border-warm"
        >
          {points.map((point) => {
            const isSelected = selected?.name === point.name;
            return (
              <button
                key={point.name}
                data-name={point.name}
                type="button"
                onClick={() => onSelect(point)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  isSelected
                    ? "bg-moss/5 border-l-2 border-l-moss"
                    : "hover:bg-warm-island"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink font-mono leading-tight">
                      {point.name}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">
                      {point.address.line1}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {point.address.post_code} {point.address.city}
                    </p>
                  </div>
                  {isSelected && (
                    <Check
                      size={15}
                      className="shrink-0 mt-0.5 text-moss"
                      strokeWidth={2}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected confirmation */}
      {selected && (
        <div className="flex items-start gap-3 rounded-field border border-moss/20 bg-moss/5 px-4 py-3">
          <Check size={15} className="shrink-0 mt-0.5 text-moss" strokeWidth={2} />
          <div>
            <p className="text-sm font-medium text-ink">
              Wybrany paczkomat:{" "}
              <span className="font-mono">{selected.name}</span>
            </p>
            <p className="text-xs text-ink-muted mt-0.5">
              {selected.address.line1}, {selected.address.city}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
