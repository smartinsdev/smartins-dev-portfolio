"use client"; // Error boundaries precisam ser client components.

import { ErrorScreen } from "@/components/status/error-screen";
import { errorTexts } from "@/i18n/error-texts";
import { localeInfo } from "@/i18n/locales";
import { usePathLocale } from "@/i18n/use-path-locale";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

/**
 * Substitui o layout raiz quando ele mesmo quebra. Fica fora de [lang] e
 * desenha o próprio <html>, então descobre o idioma pela URL.
 */
export default function GlobalError(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const locale = usePathLocale();

  return (
    <html
      lang={localeInfo[locale].htmlLang}
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full bg-ink-900 font-sans text-fg">
        <title>{errorTexts[locale].title}</title>
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
