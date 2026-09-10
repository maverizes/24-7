import type { ObjectDetail } from "@/types/api";
import type { Translator } from "@/i18n/translate";

/** Haftalik ish vaqti jadvali (TZ 13, 32). Bugungi kun ajratib ko'rsatiladi. */
export function OpeningHoursTable({
  t,
  hours,
}: {
  t: Translator;
  hours: ObjectDetail["openingHours"];
}) {
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">{t("object.hours.title")}</caption>
      <tbody>
        {hours.map((hour) => (
          <tr
            key={hour.dayOfWeek}
            className={`border-b border-line last:border-0 ${
              hour.isToday ? "font-semibold text-ink" : "text-ink-muted"
            }`}
          >
            <th scope="row" className="py-1.5 pr-3 text-left font-normal">
              {t(`common.days.${hour.dayOfWeek}` as "common.days.MONDAY")}
              {hour.isToday ? (
                <span className="ml-2 rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-medium text-brand">
                  {t("object.hours.today")}
                </span>
              ) : null}
            </th>
            <td className="py-1.5 text-right tabular-nums">
              {hour.isClosed ? (
                <span className="text-ink-subtle">{t("object.hours.closed")}</span>
              ) : hour.is24Hours ? (
                <span className="text-night">{t("object.hours.open24")}</span>
              ) : (
                `${hour.openTime} — ${hour.closeTime}`
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
