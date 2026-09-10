import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/provider";
import { createTranslator } from "@/i18n/translate";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

/** Uch tilni ham qamrab oladi: lotin, kirill va kengaytirilgan lotin. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = createTranslator(await getDictionary(locale));

  return {
    title: {
      default: `${t("common.brand.name")} — ${t("common.brand.region")}`,
      template: `%s · ${t("common.brand.name")}`,
    },
    description: t("home.hero.subtitle"),
    applicationName: t("common.brand.name"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((item) => [item, `/${item}`])),
    },
    openGraph: {
      type: "website",
      locale,
      siteName: t("common.brand.name"),
      title: `${t("common.brand.name")} — ${t("common.brand.region")}`,
      description: t("home.hero.subtitle"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const t = createTranslator(dictionary);

  return (
    <html lang={HTML_LANG[locale]} className={`${inter.variable} h-full`}>
      <body className="flex min-h-dvh flex-col bg-canvas">
        <I18nProvider locale={locale} dictionary={dictionary}>
          <a
            href="#main"
            className="sr-only-focusable absolute left-4 top-3 z-50 rounded bg-brand px-3 py-2 text-sm text-white"
          >
            {t("common.action.skipToContent")}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </I18nProvider>
      </body>
    </html>
  );
}
