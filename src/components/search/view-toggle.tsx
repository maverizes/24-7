import Link from "next/link";
import type { ObjectQuery } from "@/types/api";
import { toSearchParams } from "@/lib/query";
import { Icon } from "@/components/ui/icon";
import type { Translator } from "@/i18n/translate";

/** Ro'yxat / xarita rejimi (TZ 8, 14). Holat URL'da saqlanadi. */
export function ViewToggle({
  t,
  basePath,
  query,
  view,
}: {
  t: Translator;
  basePath: string;
  query: ObjectQuery;
  view: "list" | "map";
}) {
  function href(target: "list" | "map") {
    const params = toSearchParams(query);
    if (target === "map") params.set("view", "map");
    else params.delete("view");
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  }

  const base =
    "inline-flex h-9 items-center gap-1.5 rounded px-3 text-sm font-medium transition-colors";

  return (
    <div className="inline-flex rounded border border-line bg-surface p-0.5">
      <Link
        href={href("list")}
        aria-current={view === "list" ? "page" : undefined}
        className={`${base} ${view === "list" ? "bg-brand-soft text-brand" : "text-ink-muted"}`}
      >
        <Icon name="list" className="size-4" />
        {t("search.view.list")}
      </Link>
      <Link
        href={href("map")}
        aria-current={view === "map" ? "page" : undefined}
        className={`${base} ${view === "map" ? "bg-brand-soft text-brand" : "text-ink-muted"}`}
      >
        <Icon name="map" className="size-4" />
        {t("search.view.map")}
      </Link>
    </div>
  );
}
