"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { ObjectQuery } from "@/types/api";
import { buildHref } from "@/lib/query";

/**
 * Filtrlar URL bilan sinxron (TZ 11): har bir o'zgarish query parametrga
 * yoziladi, natijada sahifa server tomonida qayta hisoblanadi.
 */
export function useFilters(basePath: string, query: ObjectQuery) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const apply = useCallback(
    (patch: Partial<ObjectQuery>) => {
      startTransition(() => {
        router.push(buildHref(basePath, query, patch), { scroll: false });
      });
    },
    [basePath, query, router],
  );

  const toggleInArray = useCallback(
    <T,>(current: T[] | undefined, value: T): T[] => {
      const list = current ?? [];
      return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
    },
    [],
  );

  return { apply, toggleInArray, isPending, href: (patch: Partial<ObjectQuery>) => buildHref(basePath, query, patch) };
}
