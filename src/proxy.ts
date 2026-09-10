import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, matchLocale } from "@/i18n/config";

/**
 * Til prefiksisiz kelgan so'rovlarni mos tilga yo'naltiradi (TZ 24).
 * Til tanlovi cookie'da saqlanadi, aks holda Accept-Language bo'yicha aniqlanadi.
 */

const LOCALE_COOKIE = "locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
      ? cookieLocale
      : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale ?? DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Statik fayllar, API va SEO fayllaridan tashqari barcha yo'llar.
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|images|fonts|.*\\..*).*)",
  ],
};
