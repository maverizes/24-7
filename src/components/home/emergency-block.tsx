import Link from "next/link";
import type { Locale } from "@/types/domain";
import type { CategorySummary } from "@/server/api/taxonomy";
import { EMERGENCY_NUMBERS } from "@/server/db/emergency-numbers";
import { Icon } from "@/components/ui/icon";
import type { Translator } from "@/i18n/translate";

/**
 * Shoshilinch xizmatlar bloki (TZ 3.7, 6).
 * Eng kam bosish masofasi: qisqa raqamlar to'g'ridan-to'g'ri qo'ng'iroq havolasi.
 */
export function EmergencyBlock({
  t,
  locale,
  category,
}: {
  t: Translator;
  locale: Locale;
  category: CategorySummary;
}) {
  const numbers = EMERGENCY_NUMBERS.map((entry) => ({
    ...entry,
    name:
      category.subcategories.find((sub) => sub.slug === entry.subcategorySlug)?.name ??
      entry.subcategorySlug,
  }));

  return (
    <div className="rounded-card border border-alert/30 bg-alert-soft p-3">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {numbers.map((entry) => (
          <li key={entry.number}>
            <a
              href={`tel:${entry.number}`}
              className="flex min-h-16 flex-col justify-center rounded border border-alert/25 bg-surface px-3 py-2 hover:border-alert"
            >
              <span className="text-xl font-bold tabular-nums text-alert">{entry.number}</span>
              <span className="mt-0.5 truncate text-xs text-ink-muted">{entry.name}</span>
            </a>
          </li>
        ))}
      </ul>

      <Link
        href={`/${locale}/category/${category.slug}`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-alert hover:underline"
      >
        <Icon name="siren" className="size-4" />
        {t("home.emergency.cta")}
        <Icon name="chevron-right" className="size-4" />
      </Link>
    </div>
  );
}
