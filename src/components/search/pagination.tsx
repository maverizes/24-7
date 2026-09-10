import Link from "next/link";
import type { ObjectQuery, PageMeta } from "@/types/api";
import { buildHref } from "@/lib/query";
import { Icon } from "@/components/ui/icon";
import type { Translator } from "@/i18n/translate";

/** Sahifalash (TZ 26): ro'yxat birdaniga hamma obyektni yuklamaydi. */
export function Pagination({
  t,
  basePath,
  query,
  meta,
}: {
  t: Translator;
  basePath: string;
  query: ObjectQuery;
  meta: PageMeta;
}) {
  if (meta.totalPages <= 1) return null;

  const hasPrev = meta.page > 1;
  const hasNext = meta.page < meta.totalPages;

  const linkClass =
    "inline-flex h-10 items-center gap-1 rounded border border-line bg-surface px-3 text-sm font-medium text-ink-muted hover:border-line-strong";

  return (
    <nav className="mt-4 flex items-center justify-between gap-3" aria-label={t("search.title")}>
      {hasPrev ? (
        <Link href={buildHref(basePath, query, { page: meta.page - 1 })} className={linkClass}>
          <Icon name="chevron-left" className="size-4" />
          {t("search.pagination.prev")}
        </Link>
      ) : (
        <span className={`${linkClass} pointer-events-none opacity-40`}>
          <Icon name="chevron-left" className="size-4" />
          {t("search.pagination.prev")}
        </span>
      )}

      <span className="text-sm tabular-nums text-ink-subtle">
        {t("search.pagination.page", { page: meta.page, total: meta.totalPages })}
      </span>

      {hasNext ? (
        <Link href={buildHref(basePath, query, { page: meta.page + 1 })} className={linkClass}>
          {t("search.pagination.next")}
          <Icon name="chevron-right" className="size-4" />
        </Link>
      ) : (
        <span className={`${linkClass} pointer-events-none opacity-40`}>
          {t("search.pagination.next")}
          <Icon name="chevron-right" className="size-4" />
        </span>
      )}
    </nav>
  );
}
