import type { MetadataRoute } from "next";
import { hreflangPaths, locales } from "@/i18n/locales";
import { siteUrl } from "@/lib/site-url";

const absolute = (path: string) => new URL(path, siteUrl).href;

// Uma entrada por idioma. As duas repetem o par pt-BR/en em
// `alternates.languages`: é assim que o Google entende que são a mesma
// página traduzida.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(hreflangPaths).map(([hreflang, path]) => [
      hreflang,
      absolute(path),
    ]),
  );

  return locales.map((locale) => ({
    url: absolute(`/${locale}`),
    lastModified: new Date(),
    alternates: { languages },
  }));
}
