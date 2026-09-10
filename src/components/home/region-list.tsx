import Link from "next/link";
import type { Locale } from "@/types/domain";
import type { RegionSummary } from "@/server/api/taxonomy";
import { formatCount } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import type { Translator } from "@/i18n/translate";

/** Hududlar ro'yxati (TZ 6, 15): obyektlar soni va hozir ochiqlari bilan. */
export function RegionList({
  t,
  locale,
  title,
  regions,
}: {
  t: Translator;
  locale: Locale;
  title: string;
  regions: RegionSummary[];
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink-muted">{title}</h3>
      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <li key={region.slug}>
            <Link
              href={`/${locale}/region/${region.slug}`}
              className="flex items-center justify-between gap-2 rounded border border-line bg-surface px-3 py-2 hover:border-brand"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">{region.name}</span>
                <span className="mt-0.5 flex flex-wrap gap-x-2 text-xs">
                  <span className="tabular-nums text-ink-subtle">
                    {t("common.misc.objectsCount", { count: formatCount(region.count) })}
                  </span>
                  <span className="tabular-nums text-open">
                    {t("common.misc.openNowCount", { count: formatCount(region.openNowCount) })}
                  </span>
                </span>
              </span>
              <Icon name="chevron-right" className="size-4 shrink-0 text-ink-subtle" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
