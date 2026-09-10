import { formatCount } from "@/lib/format";
import type { Translator } from "@/i18n/translate";

/** Platforma bo'yicha umumiy raqamlar (TZ 6). */
export function StatsStrip({
  t,
  stats,
}: {
  t: Translator;
  stats: { total: number; openNow: number; night: number; awards: number };
}) {
  const items = [
    { label: t("home.stats.objects"), value: stats.total, tone: "text-ink" },
    { label: t("home.stats.openNow"), value: stats.openNow, tone: "text-open" },
    { label: t("home.stats.night"), value: stats.night, tone: "text-night" },
    { label: t("home.stats.awards"), value: stats.awards, tone: "text-award" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-card border border-line bg-surface px-3 py-2.5">
          <dt className="text-xs text-ink-subtle">{item.label}</dt>
          <dd className={`mt-0.5 text-lg font-semibold tabular-nums ${item.tone}`}>
            {formatCount(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
