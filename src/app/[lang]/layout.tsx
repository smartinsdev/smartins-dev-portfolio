import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { site } from "@/data/site";
import { hasLocale, localeInfo, locales } from "@/i18n/locales";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site-url";
import { themeColors } from "@/lib/theme-colors";
import "../globals.css";

const title = `${site.name} — Portfólio`;
const description = `${site.role}. Portfólio de ${site.name}.`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: title, template: `%s — ${site.name}` },
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: title,
    title,
    description,
  },
  twitter: { card: "summary_large_image" },
};

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
