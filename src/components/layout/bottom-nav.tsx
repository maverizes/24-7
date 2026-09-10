"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";

/** Mobil pastki navigatsiya (TZ 27). Har bir element ≥ 44px tegish maydoni. */
export function BottomNav() {
  const { t, locale } = useI18n();
  const pathname = usePathname();

  const items = [
    { href: `/${locale}`, icon: "home", label: t("common.nav.home"), exact: true },
    { href: `/${locale}/search`, icon: "search", label: t("common.nav.search"), exact: false },
    {
      href: `/${locale}/search?view=map`,
      icon: "map",
      label: t("common.nav.map"),
      exact: false,
    },
    { href: `/${locale}/regions`, icon: "map-pin", label: t("common.nav.regions"), exact: false },
  ];

  return (
    <nav
      className="sticky bottom-0 z-30 border-t border-line bg-surface md:hidden"
      aria-label={t("common.nav.home")}
    >
      <ul className="mx-auto flex max-w-6xl">
        {items.map((item) => {
          const path = item.href.split("?")[0];
          const isActive = item.exact ? pathname === path : pathname.startsWith(path);

          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] ${
                  isActive ? "text-brand" : "text-ink-subtle"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
