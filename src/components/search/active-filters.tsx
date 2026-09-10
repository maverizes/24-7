"use client";

import type { ObjectQuery, ObjectSearchResult } from "@/types/api";
import { clearedQuery, countActiveFilters } from "@/lib/query";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";
import { useFilters } from "./use-filters";

/** Faol filtrlar chiplari — har birini alohida olib tashlash mumkin. */
export function ActiveFilters({
  basePath,
  query,
  facets,
}: {
  basePath: string;
  query: ObjectQuery;
  facets: ObjectSearchResult["facets"];
}) {
  const { t } = useI18n();
  const { apply } = useFilters(basePath, query);

  if (countActiveFilters(query) === 0) return null;

  const chips: Array<{ key: string; label: string; clear: Partial<ObjectQuery> }> = [];

  if (query.openState && query.openState !== "open_now") {
    chips.push({
      key: "open",
      label: t(`search.status.${query.openState}` as "search.status.closed"),
      clear: { openState: "open_now" },
    });
  }

  const category = facets.categories.find((item) => item.slug === query.category);
  if (category) {
    chips.push({
      key: "category",
      label: category.name,
      clear: { category: undefined, subcategory: undefined },
    });
  }

  const region = facets.regions.find((item) => item.slug === query.region);
  if (region) {
    chips.push({ key: "region", label: region.name, clear: { region: undefined } });
  }

  if (query.ratingMin) {
    chips.push({
      key: "rating",
      label: t("search.rating.min", { value: query.ratingMin.toFixed(1) }),
      clear: { ratingMin: undefined },
    });
  }

  for (const level of query.priceLevels ?? []) {
    chips.push({
      key: `price-${level}`,
      label: t(`search.price.level${level}` as "search.price.level1"),
      clear: { priceLevels: (query.priceLevels ?? []).filter((item) => item !== level) },
    });
  }

  for (const slug of query.services ?? []) {
    const service = facets.services.find((item) => item.slug === slug);
    if (!service) continue;
    chips.push({
      key: `service-${slug}`,
      label: service.name,
      clear: { services: (query.services ?? []).filter((item) => item !== slug) },
    });
  }

  if (query.distanceMax) {
    chips.push({
      key: "distance",
      label: t("search.distance.value", {
        value: t("common.distance.km", { value: String(query.distanceMax) }),
      }),
      clear: { distanceMax: undefined },
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => apply(chip.clear)}
          className="inline-flex h-8 items-center gap-1.5 rounded border border-brand/30 bg-brand-soft px-2.5 text-xs font-medium text-brand hover:border-brand"
        >
          {chip.label}
          <Icon name="close" className="size-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => apply(clearedQuery(query))}
        className="inline-flex h-8 items-center px-2 text-xs font-medium text-ink-subtle underline hover:text-ink"
      >
        {t("common.action.clearFilters")}
      </button>
    </div>
  );
}
