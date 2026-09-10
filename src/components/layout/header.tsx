"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { Icon } from "@/components/ui/icon";
import { LanguageSwitcher } from "./language-switcher";

/** Sayt sarlavhasi (TZ 6): logo, qidiruv, til, kirish. */
export function Header() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const isSearchPage = pathname.startsWith(`/${locale}/search`);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-2"
          aria-label={t("common.brand.name")}
        >
          <span className="rounded bg-brand px-1.5 py-1 text-sm font-bold tracking-tight text-white">
            24/7
          </span>
          <span className="hidden text-xs leading-tight text-ink-muted sm:block">
            {t("common.brand.region")}
          </span>
        </Link>

        {!isSearchPage ? (
          <Link
            href={`/${locale}/search`}
            className="ml-2 hidden h-9 flex-1 items-center gap-2 rounded border border-line bg-canvas px-3 text-sm text-ink-subtle hover:border-line-strong md:flex"
          >
            <Icon name="search" className="size-4" />
            {t("search.placeholder")}
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        <div className="ml-auto flex items-center gap-1">
          <Link
            href={`/${locale}/search`}
            className="inline-flex size-9 items-center justify-center rounded text-ink-muted hover:bg-canvas md:hidden"
            aria-label={t("common.action.search")}
          >
            <Icon name="search" className="size-5" />
          </Link>
          <LanguageSwitcher />
          <Link
            href={`/${locale}/login`}
            className="inline-flex h-9 items-center gap-1.5 rounded border border-line px-3 text-sm font-medium text-ink-muted hover:border-line-strong hover:text-ink"
          >
            <Icon name="user" className="size-4" />
            <span className="hidden sm:inline">{t("common.auth.login")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
