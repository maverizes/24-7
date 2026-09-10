"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import type { ObjectListItem } from "@/types/api";
import type { GeoPoint } from "@/types/domain";
import "leaflet/dist/leaflet.css";

/**
 * Xarita (TZ 14): markerlar, klasterlash, joriy lokatsiya va ro'yxat bilan
 * sinxronizatsiya. Leaflet + OpenStreetMap plitalari ishlatiladi.
 *
 * Klasterlash qo'shimcha kutubxonasiz, oddiy grid-klaster algoritmi bilan
 * amalga oshirilgan — 300 gacha marker uchun yetarli va bog'liqlik qo'shmaydi.
 */

interface Cluster {
  key: string;
  lat: number;
  lng: number;
  items: ObjectListItem[];
}

/** Zoom darajasiga qarab yaqin markerlarni bitta belgiga birlashtiradi. */
function clusterize(items: ObjectListItem[], zoom: number): Cluster[] {
  const cellSize = 0.6 / 2 ** Math.max(0, zoom - 8);
  const cells = new Map<string, Cluster>();

  for (const item of items) {
    const row = Math.floor(item.location.lat / cellSize);
    const column = Math.floor(item.location.lng / cellSize);
    const key = `${row}:${column}`;
    const existing = cells.get(key);

    if (existing) {
      existing.items.push(item);
      existing.lat = (existing.lat * (existing.items.length - 1) + item.location.lat) / existing.items.length;
      existing.lng = (existing.lng * (existing.items.length - 1) + item.location.lng) / existing.items.length;
    } else {
      cells.set(key, { key, lat: item.location.lat, lng: item.location.lng, items: [item] });
    }
  }

  return [...cells.values()];
}

function markerIcon(count: number, isOpen: boolean): L.DivIcon {
  if (count > 1) {
    const size = count > 50 ? 46 : count > 15 ? 40 : 34;
    return L.divIcon({
      className: "",
      html: `<div style="width:${size}px;height:${size}px" class="flex items-center justify-center rounded-full border-2 border-white bg-brand text-xs font-bold text-white shadow-md">${count}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  const color = isOpen ? "var(--color-open)" : "var(--color-ink-subtle)";
  return L.divIcon({
    className: "",
    html: `<div style="background:${color}" class="size-3.5 rounded-full border-2 border-white shadow"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function LeafletMap({
  items,
  center,
  userLocation,
  selectedSlug,
  onSelect,
  initialZoom = 9,
}: {
  items: ObjectListItem[];
  center: GeoPoint;
  userLocation?: GeoPoint;
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  initialZoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [zoom, setZoom] = useState(initialZoom);

  // Xarita bir marta yaratiladi.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    map.on("zoomend", () => setZoom(map.getZoom()));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng]);

  const clusters = useMemo(() => clusterize(items, zoom), [items, zoom]);

  // Markerlarni qayta chizish.
  useEffect(() => {
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;

    layer.clearLayers();

    for (const cluster of clusters) {
      const isOpen = cluster.items.some((item) => item.openStatus.isOpenNow);
      const marker = L.marker([cluster.lat, cluster.lng], {
        icon: markerIcon(cluster.items.length, isOpen),
        keyboard: true,
        title: cluster.items.length === 1 ? cluster.items[0].name : undefined,
      });

      marker.on("click", () => {
        if (cluster.items.length === 1) {
          onSelect(cluster.items[0].slug);
        } else {
          map.setView([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, 16));
        }
      });

      layer.addLayer(marker);
    }

    if (userLocation) {
      layer.addLayer(
        L.circleMarker([userLocation.lat, userLocation.lng], {
          radius: 7,
          color: "#ffffff",
          weight: 2,
          fillColor: "#0e4c92",
          fillOpacity: 1,
        }),
      );
    }
  }, [clusters, onSelect, userLocation]);

  // Ro'yxatdan tanlangan obyektga markazlashish (ro'yxat ↔ xarita sinxroni).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSlug) return;
    const item = items.find((candidate) => candidate.slug === selectedSlug);
    if (item) map.setView([item.location.lat, item.location.lng], Math.max(map.getZoom(), 13));
  }, [selectedSlug, items]);

  return <div ref={containerRef} className="size-full" />;
}
