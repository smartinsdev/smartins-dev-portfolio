// Fonte única dos idiomas do site. É importado pelo proxy, pelo servidor,
// pelo cliente e pelos testes (`pnpm test`).
//
// Os arquivos de i18n testados com `node --test` (este, negotiate-locale e
// localize-path) se importam com ".ts" no final e sem o alias "@/": o Node
// roda TypeScript direto, mas não conhece nenhum desses dois atalhos.

export const locales = ["pt-br", "en"] as const;

export type Locale = (typeof locales)[number];

/** Vale para quem não tem nem português nem inglês no navegador. */
export const defaultLocale: Locale = "en";

/** Cookie gravado quando a pessoa escolhe o idioma no painel. */
export const LOCALE_COOKIE = "locale";

/** Type guard: depois de `if (hasLocale(x))`, o TypeScript trata x como Locale. */
export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

type LocaleInfo = {
  /** Vai no <html lang> e no hreflang. */
  htmlLang: string;
  /** Vai no og:locale (formato com "_"). */
  ogLocale: string;
  /** Nome no seletor, escrito no próprio idioma. */
  name: string;
};

export const localeInfo: Record<Locale, LocaleInfo> = {
  "pt-br": { htmlLang: "pt-BR", ogLocale: "pt_BR", name: "Português" },
  en: { htmlLang: "en", ogLocale: "en_US", name: "English" },
};

/**
 * Caminho de cada idioma no formato do hreflang:
 * { "pt-BR": "/pt-br", en: "/en" }. Usado nos metadados e no sitemap.
 */
export const hreflangPaths: Record<string, string> = Object.fromEntries(
  locales.map((locale) => [localeInfo[locale].htmlLang, `/${locale}`]),
);
