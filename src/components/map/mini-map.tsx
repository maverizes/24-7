"use client";

import dynamic from "next/dynamic";
import type { ObjectListItem } from "@/types/api";

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-canvas" />,
});

/** Obyekt sahifasidagi kichik xarita — bitta marker, yaqin masshtab. */
export function MiniMap({ item }: { item: ObjectListItem }) {
  return (
    <div className="h-56 overflow-hidden rounded border border-line">
      <LeafletMap
        items={[item]}
        center={item.location}
        selectedSlug={null}
        onSelect={() => undefined}
        initialZoom={14}
      />
    </div>
  );
}
