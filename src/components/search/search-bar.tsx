"use client";

import { useEffect, useRef, useState } from "react";
import type { ObjectQuery } from "@/types/api";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";
import { useFilters } from "./use-filters";

/**
 * Qidiruv maydoni. Yozish to'xtagach 400 ms dan keyin URL yangilanadi
 * (debounce — TZ 26), shu bilan har bir harf uchun so'rov yuborilmaydi.
 */
export function SearchBar({ basePath, query }: { basePath: string; query: ObjectQuery }) {
  const { t } = useI18n();
  const { apply } = useFilters(basePath, query);
  const [value, setValue] = useState(query.q ?? "");
  const lastPushed = useRef(query.q ?? "");

  useEffect(() => {
    setValue(query.q ?? "");
    lastPushed.current = query.q ?? "";
  }, [query.q]);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === lastPushed.current) return;

    const timer = setTimeout(() => {
      lastPushed.current = trimmed;
      apply({ q: trimmed || undefined });
    }, 400);

    return () => clearTimeout(timer);
  }, [value, apply]);

  return (
    <div
      className="flex h-11 items-center gap-2 rounded border border-line bg-surface px-3 focus-within:border-brand"
      role="search"
    >
      <Icon name="search" className="size-4 shrink-0 text-ink-subtle" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("search.placeholder")}
        aria-label={t("search.title")}
        className="h-full w-full bg-transparent text-sm outline-none placeholder:text-ink-subtle"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          className="shrink-0 rounded p-1 text-ink-subtle hover:bg-canvas"
          aria-label={t("common.action.clear")}
        >
          <Icon name="close" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
