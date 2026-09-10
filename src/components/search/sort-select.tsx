"use client";

import type { ObjectQuery, SortKey } from "@/types/api";
import { SORT_KEYS } from "@/lib/query";
import { useI18n } from "@/i18n/provider";
import { useFilters } from "./use-filters";

/** Saralash (TZ 12). Native select — mobil va klaviatura uchun eng qulay. */
export function SortSelect({
  basePath,
  query,
  hasLocation,
}: {
  basePath: string;
  query: ObjectQuery;
  hasLocation: boolean;
}) {
  const { t } = useI18n();
  const { apply } = useFilters(basePath, query);

  return (
    <label className="inline-flex h-10 items-center gap-2 rounded border border-line bg-surface px-3 text-sm">
      <span className="text-ink-subtle">{t("search.sort.label")}</span>
      <select
        value={query.sort ?? "recommended"}
        onChange={(event) => apply({ sort: event.target.value as SortKey })}
        className="bg-transparent font-medium text-ink outline-none"
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key} disabled={key === "distance" && !hasLocation}>
            {t(`search.sort.${key}` as "search.sort.rating")}
          </option>
        ))}
      </select>
    </label>
  );
}
