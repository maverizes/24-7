import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createTranslator } from "@/i18n/translate";
import { searchObjects, searchObjectsForMap } from "@/server/api/objects";
import { getProvince } from "@/server/api/taxonomy";
import { formatCount } from "@/lib/format";
import { buildHref, parseObjectQuery } from "@/lib/query";
import { ObjectGrid } from "@/components/object/object-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { ActiveFilters } from "@/components/search/active-filters";
import { FilterControls } from "@/components/search/filter-controls";
import { FilterSheet } from "@/components/search/filter-sheet";
import { LocationButton } from "@/components/search/location-button";
import { Pagination } from "@/components/search/pagination";
import { SearchBar } from "@/components/search/search-bar";
import { SortSelect } from "@/components/search/sort-select";
import { ViewToggle } from "@/components/search/view-toggle";
import { ObjectMap } from "@/components/map/object-map";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = createTranslator(await getDictionary(locale));

  return {
    title: t("search.title"),
    // Filtrlangan natijalar indekslanmaydi — dublikat kontentning oldini oladi.
    robots: { index: false, follow: true },
  };
}

/** Obyektlar ro'yxati: filtr + saralash + xarita (TZ 8, 11, 12, 14). */
export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const rawParams = await searchParams;
  const t = createTranslator(await getDictionary(locale));
  const query = parseObjectQuery(rawParams);
  const basePath = `/${locale}/search`;
  const view = rawParams.view === "map" ? "map" : "list";

  const result = searchObjects(query, locale);
  const hasLocation = query.lat !== undefined && query.lng !== undefined;
  const province = getProvince(locale);
  const mapItems = view === "map" ? searchObjectsForMap(query, locale) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-canvas/95 px-4 py-2 backdrop-blur">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchBar basePath={basePath} query={query} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scroll-row">
            <FilterSheet basePath={basePath} query={query} facets={result.facets} />
            <SortSelect basePath={basePath} query={query} hasLocation={hasLocation} />
            <LocationButton basePath={basePath} query={query} />
            <ViewToggle t={t} basePath={basePath} query={query} view={view} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32 overflow-hidden rounded-card border border-line bg-surface">
            <h2 className="border-b border-line px-4 py-3 text-sm font-semibold text-ink">
              {t("search.filters.title")}
            </h2>
            <div className="max-h-[calc(100dvh-16rem)] overflow-y-auto">
              <FilterControls basePath={basePath} query={query} facets={result.facets} />
            </div>
          </div>
        </aside>

        <section aria-label={t("search.title")}>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-base font-semibold text-ink">
              {t("search.resultsCount", { count: formatCount(result.meta.total) })}
              {query.q ? <span className="text-ink-muted"> · “{query.q}”</span> : null}
            </h1>
            <p className="text-sm tabular-nums text-open">
              {t("common.misc.openNowCount", { count: formatCount(result.facets.openNow) })}
            </p>
          </div>

          <div className="mb-3">
            <ActiveFilters basePath={basePath} query={query} facets={result.facets} />
          </div>

          {result.meta.total === 0 ? (
            <EmptyState
              title={
                result.relaxedTotal > 0
                  ? t("search.empty.relaxedTitle")
                  : t("search.empty.title")
              }
              description={
                result.relaxedTotal > 0
                  ? t("search.empty.relaxedDescription")
                  : t("search.empty.description")
              }
              secondaryAction={
                result.relaxedTotal > 0
                  ? {
                      href: buildHref(basePath, query, { openState: "all" }),
                      label: t("search.empty.relaxedAction", {
                        count: formatCount(result.relaxedTotal),
                      }),
                    }
                  : undefined
              }
              action={{ href: basePath, label: t("search.empty.action") }}
            />
          ) : view === "map" ? (
            <ObjectMap
              items={mapItems}
              center={province.center}
              userLocation={
                hasLocation && query.lat !== undefined && query.lng !== undefined
                  ? { lat: query.lat, lng: query.lng }
                  : undefined
              }
            />
          ) : (
            <>
              <ObjectGrid items={result.data} columns={1} showDistance={hasLocation} />
              <Pagination t={t} basePath={basePath} query={query} meta={result.meta} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
