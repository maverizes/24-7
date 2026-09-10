"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { ObjectListItem } from "@/types/api";
import type { GeoPoint } from "@/types/domain";
import { ObjectCard } from "@/components/object/object-card";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";

/** Leaflet faqat brauzerda ishlaydi — SSR o'chirilgan holda yuklanadi. */
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-canvas text-sm text-ink-subtle">
      <span className="animate-pulse">…</span>
    </div>
  ),
});

/**
 * Xarita ko'rinishi: markerlar va tanlangan obyekt kartochkasi
 * bir-biriga bog'langan (TZ 14).
 */
export function ObjectMap({
  items,
  center,
  userLocation,
}: {
  items: ObjectListItem[];
  center: GeoPoint;
  userLocation?: GeoPoint;
}) {
  const { t } = useI18n();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = items.find((item) => item.slug === selectedSlug) ?? null;

  return (
    <div className="relative h-[65dvh] overflow-hidden rounded-card border border-line bg-surface lg:h-[calc(100dvh-13rem)]">
      <LeafletMap
        items={items}
        center={center}
        userLocation={userLocation}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
      />

      {selected ? (
        <div className="absolute inset-x-2 bottom-2 z-[1000]">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="absolute right-2 top-2 z-10 inline-flex size-8 items-center justify-center rounded-full border border-line bg-surface text-ink-muted shadow"
              aria-label={t("common.action.close")}
            >
              <Icon name="close" className="size-4" />
            </button>
            <ObjectCard item={selected} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
