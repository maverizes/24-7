"use client";

import type { ObjectQuery, ObjectSearchResult, OpenStateFilter } from "@/types/api";
import { DISTANCE_STEPS, PRICE_LEVELS, RATING_STEPS, clearedQuery } from "@/lib/query";
import { formatCount, formatDistance, priceLevelSymbol } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";
import { useFilters } from "./use-filters";

/**
 * Filtrlar to'plami (TZ 11). Desktopda chap panelda, mobil qurilmada
 * pastdan chiqadigan varaqda — bir xil komponent ishlatiladi.
 */

const OPEN_STATES: OpenStateFilter[] = ["open_now", "24_7", "opens_later", "closed"];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line px-4 py-3 first:border-t-0">
      <legend className="sr-only">{title}</legend>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        {title}
      </p>
      {children}
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded border px-2.5 text-sm transition-colors disabled:opacity-45 ${
        active
          ? "border-brand bg-brand-soft font-medium text-brand"
          : "border-line bg-surface text-ink-muted hover:border-line-strong"
      }`}
    >
      {children}
    </button>
  );
}

export function FilterControls({
  basePath,
  query,
  facets,
  onApplied,
}: {
  basePath: string;
  query: ObjectQuery;
  facets: ObjectSearchResult["facets"];
  onApplied?: () => void;
}) {
  const { t } = useI18n();
  const { apply, toggleInArray } = useFilters(basePath, query);
  const hasLocation = query.lat !== undefined && query.lng !== undefined;

  function update(patch: Partial<ObjectQuery>) {
    apply(patch);
    onApplied?.();
  }

  return (
    <div className="divide-y divide-line">
      <Group title={t("search.filters.status")}>
        <div className="flex flex-wrap gap-1.5">
          {OPEN_STATES.map((state) => (
            <Chip
              key={state}
              active={query.openState === state}
              onClick={() => update({ openState: query.openState === state ? "all" : state })}
            >
              {state === "open_now" ? <Icon name="check" className="size-3.5" /> : null}
              {t(`search.status.${state}` as "search.status.open_now")}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title={t("search.filters.category")}>
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => update({ category: undefined, subcategory: undefined })}
            className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-canvas ${
              !query.category ? "font-semibold text-brand" : "text-ink-muted"
            }`}
          >
            {t("search.filters.allCategories")}
          </button>
          {facets.categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              disabled={category.count === 0 && query.category !== category.slug}
              onClick={() =>
                update({
                  category: query.category === category.slug ? undefined : category.slug,
                  subcategory: undefined,
                })
              }
              className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-canvas disabled:opacity-40 ${
                query.category === category.slug ? "font-semibold text-brand" : "text-ink-muted"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                {category.icon ? <Icon name={category.icon} className="size-4 shrink-0" /> : null}
                <span className="truncate">{category.name}</span>
              </span>
              <span className="shrink-0 tabular-nums text-xs text-ink-subtle">
                {formatCount(category.count)}
              </span>
            </button>
          ))}
        </div>
      </Group>

      <Group title={t("search.filters.region")}>
        <select
          value={query.region ?? ""}
          onChange={(event) => update({ region: event.target.value || undefined })}
          className="h-10 w-full rounded border border-line bg-surface px-2 text-sm"
        >
          <option value="">{t("search.filters.allRegions")}</option>
          {facets.regions.map((region) => (
            <option key={region.slug} value={region.slug}>
              {region.name} ({formatCount(region.count)})
            </option>
          ))}
        </select>
      </Group>

      <Group title={t("search.filters.rating")}>
        <div className="flex flex-wrap gap-1.5">
          {RATING_STEPS.map((rating) => (
            <Chip
              key={rating}
              active={query.ratingMin === rating}
              onClick={() => update({ ratingMin: query.ratingMin === rating ? undefined : rating })}
            >
              <Icon name="star" className="size-3.5 fill-award text-award" strokeWidth={0} />
              {t("search.rating.min", { value: rating.toFixed(1) })}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title={t("search.filters.price")}>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_LEVELS.map((level) => (
            <Chip
              key={level}
              active={query.priceLevels?.includes(level) ?? false}
              onClick={() => update({ priceLevels: toggleInArray(query.priceLevels, level) })}
            >
              <span className="font-semibold">{priceLevelSymbol(level)}</span>
              <span className="text-xs">
                {t(`search.price.level${level}` as "search.price.level1")}
              </span>
            </Chip>
          ))}
        </div>
      </Group>

      <Group title={t("search.filters.distance")}>
        {hasLocation ? (
          <div className="flex flex-wrap gap-1.5">
            {DISTANCE_STEPS.map((step) => {
              const label = formatDistance(step);
              return (
                <Chip
                  key={step}
                  active={query.distanceMax === step}
                  onClick={() =>
                    update({ distanceMax: query.distanceMax === step ? undefined : step })
                  }
                >
                  {t("search.distance.value", {
                    value: t(`common.distance.${label.unit}`, { value: label.value }),
                  })}
                </Chip>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-ink-subtle">{t("search.distance.needsLocation")}</p>
        )}
      </Group>

      <Group title={t("search.filters.services")}>
        <div className="flex flex-wrap gap-1.5">
          {facets.services.map((service) => (
            <Chip
              key={service.slug}
              active={query.services?.includes(service.slug) ?? false}
              disabled={service.count === 0 && !query.services?.includes(service.slug)}
              onClick={() => update({ services: toggleInArray(query.services, service.slug) })}
            >
              {service.icon ? <Icon name={service.icon} className="size-3.5" /> : null}
              {service.name}
              <span className="tabular-nums text-xs text-ink-subtle">{service.count}</span>
            </Chip>
          ))}
        </div>
      </Group>

      <div className="px-4 py-3">
        <button
          type="button"
          onClick={() => update(clearedQuery(query))}
          className="inline-flex h-9 items-center gap-1.5 rounded border border-line px-3 text-sm text-ink-muted hover:border-line-strong"
        >
          <Icon name="close" className="size-4" />
          {t("search.filters.reset")}
        </button>
      </div>
    </div>
  );
}
