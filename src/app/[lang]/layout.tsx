import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { site } from "@/data/site";
import { dictionaries } from "@/i18n/dictionaries";
import { hasLocale, hreflangPaths, localeInfo, locales } from "@/i18n/locales";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site-url";
import { themeColors } from "@/lib/theme-colors";
import "../globals.css";

type LayoutParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { meta } = dictionaries[lang];
  const title = `${site.name} — ${meta.title}`;

  return {
    metadataBase: siteUrl,
    title: { default: title, template: `%s — ${site.name}` },
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      // hreflang: avisa o Google que /pt-br e /en são a mesma página em
      // dois idiomas. x-default é para quem não lê nenhum dos dois: "/"
      // deixa o proxy escolher.
      languages: { ...hreflangPaths, "x-default": "/" },
    },
    openGraph: {
      type: "website",
      locale: localeInfo[lang].ogLocale,
      alternateLocale: locales
        .filter((other) => other !== lang)
        .map((other) => localeInfo[other].ogLocale),
      siteName: title,
      title,
      description: meta.description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: themeColors.ink900,
  colorScheme: "dark",
};

// Gera /pt-br e /en no build, como páginas estáticas.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  // O proxy só deixa passar idiomas válidos. Isto cobre o que ele ignora
  // (caminhos com ponto, como /foo.png).
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={localeInfo[lang].htmlLang}
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink-900 font-sans text-fg">
        {children}
      </body>
    </html>
  );
}
