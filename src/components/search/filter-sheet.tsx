"use client";

import { useEffect, useRef, useState } from "react";
import type { ObjectQuery, ObjectSearchResult } from "@/types/api";
import { countActiveFilters } from "@/lib/query";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";
import { FilterControls } from "./filter-controls";

/**
 * Mobil filtr varag'i (TZ 27). `<dialog>` elementi ishlatiladi — fokus
 * qamrovi va Esc bilan yopish brauzer tomonidan ta'minlanadi (TZ 29).
 */
export function FilterSheet({
  basePath,
  query,
  facets,
}: {
  basePath: string;
  query: ObjectQuery;
  facets: ObjectSearchResult["facets"];
}) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setOpen] = useState(false);
  const activeCount = countActiveFilters(query);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-1.5 rounded border border-line bg-surface px-3 text-sm font-medium text-ink-muted lg:hidden"
      >
        <Icon name="filter" className="size-4" />
        {t("common.action.filter")}
        {activeCount > 0 ? (
          <span className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label={t("search.filters.title")}
        className="m-0 mt-auto max-h-[85dvh] w-full max-w-xl rounded-t-xl bg-surface p-0 backdrop:bg-ink/40 sm:mx-auto sm:mb-auto sm:mt-[5dvh] sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-semibold text-ink">{t("search.filters.title")}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex size-9 items-center justify-center rounded text-ink-muted hover:bg-canvas"
            aria-label={t("common.action.close")}
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <div className="max-h-[60dvh] overflow-y-auto overscroll-contain">
          <FilterControls basePath={basePath} query={query} facets={facets} />
        </div>

        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-11 w-full rounded bg-brand text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {t("search.filters.apply")}
          </button>
        </div>
      </dialog>
    </>
  );
}
