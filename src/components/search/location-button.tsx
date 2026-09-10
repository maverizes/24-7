"use client";

import { useState } from "react";
import type { ObjectQuery } from "@/types/api";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";
import { useFilters } from "./use-filters";

/**
 * Lokatsiyani yoqish. Koordinatalar URL query'ga yoziladi va masofa
 * server tomonida hisoblanadi (TZ Rule 9).
 */
export function LocationButton({
  basePath,
  query,
}: {
  basePath: string;
  query: ObjectQuery;
}) {
  const { t } = useI18n();
  const { apply } = useFilters(basePath, query);
  const [state, setState] = useState<"idle" | "loading" | "denied">("idle");
  const hasLocation = query.lat !== undefined && query.lng !== undefined;

  if (hasLocation) {
    return (
      <button
        type="button"
        onClick={() => apply({ lat: undefined, lng: undefined, distanceMax: undefined })}
        className="inline-flex h-10 items-center gap-1.5 rounded border border-open/40 bg-open-soft px-3 text-sm font-medium text-open"
      >
        <Icon name="navigation" className="size-4" />
        {t("search.location.enabled")}
        <Icon name="close" className="size-3.5" />
      </button>
    );
  }

  function request() {
    if (!navigator.geolocation) {
      setState("denied");
      return;
    }
    setState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState("idle");
        apply({
          lat: Number(position.coords.latitude.toFixed(5)),
          lng: Number(position.coords.longitude.toFixed(5)),
        });
      },
      () => setState("denied"),
      { timeout: 8000 },
    );
  }

  return (
    <button
      type="button"
      onClick={request}
      disabled={state === "loading"}
      className="inline-flex h-10 items-center gap-1.5 rounded border border-line bg-surface px-3 text-sm text-ink-muted hover:border-line-strong disabled:opacity-60"
    >
      <Icon name="navigation" className="size-4" />
      {state === "loading"
        ? t("search.location.loading")
        : state === "denied"
          ? t("search.location.denied")
          : t("common.action.enableLocation")}
    </button>
  );
}
