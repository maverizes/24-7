import Link from "next/link";
import type { Locale } from "@/types/domain";
import type { CategorySummary } from "@/server/api/taxonomy";
import { formatCount } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import type { Translator } from "@/i18n/translate";

/** Asosiy modullar (TZ 3, 6). Mobil — 2 ustun, desktop — 4 ustun. */
export function CategoryGrid({
  t,
  locale,
  categories,
}: {
  t: Translator;
  locale: Locale;
  categories: CategorySummary[];
}) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <li key={category.slug}>
          <Link
            href={`/${locale}/category/${category.slug}`}
            className={`flex h-full min-h-[88px] flex-col justify-between rounded-card border bg-surface p-3 transition-colors hover:border-brand ${
              category.isEmergency ? "border-alert/30" : "border-line"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded ${
                  category.isEmergency
                    ? "bg-alert-soft text-alert"
                    : category.isNightModule
                      ? "bg-night-soft text-night"
                      : "bg-brand-soft text-brand"
                }`}
              >
                <Icon name={category.icon} className="size-4.5" />
              </span>
              <span className="min-w-0 text-sm font-semibold text-ink">{category.name}</span>
            </span>
            <span className="mt-2 flex items-baseline gap-2 text-xs">
              <span className="tabular-nums text-ink-muted">
                {t("common.misc.objectsCount", { count: formatCount(category.count) })}
              </span>
              <span className="tabular-nums text-open">
                {t("common.misc.openNowCount", { count: formatCount(category.openNowCount) })}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
