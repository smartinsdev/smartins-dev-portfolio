import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { site } from "@/data/site";
import { dictionaries } from "@/i18n/dictionaries";
import { hasLocale, hreflangPaths, localeInfo, locales } from "@/i18n/locales";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site-url";
import { themeColors } from "@/lib/theme-colors";
import { themeScript } from "@/theme/theme-script";
import { ThemeSync } from "@/theme/theme-sync";
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
  // Cor da barra do navegador, uma para cada tema do sistema. Com
  // escolha forçada no painel, o applyTheme (src/theme/theme-store.ts)
  // troca as duas.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.pageLight },
    { media: "(prefers-color-scheme: dark)", color: themeColors.pageDark },
  ],
  // Avisa o navegador, antes de o CSS chegar, que a página tem os dois temas.
  colorScheme: "light dark",
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
    // suppressHydrationWarning: o script do <head> põe data-theme no
    // <html> antes de o React carregar. Isto diz ao React para aceitar o
    // que está no DOM em vez de reclamar da diferença.
    <html
      lang={localeInfo[lang].htmlLang}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Roda enquanto o navegador lê o HTML, antes da primeira pintura:
            a escolha salva aparece sem piscar o outro tema. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: texto fixo, montado em theme-script.ts só com constantes do projeto
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-page font-sans text-fg">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
