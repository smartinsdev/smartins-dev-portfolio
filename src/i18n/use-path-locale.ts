import { usePathname } from "next/navigation";
import { defaultLocale, type Locale } from "./locales";
import { pathLocale } from "./localize-path";

/**
 * Idioma da página atual em client components, lido do começo da URL.
 * No servidor, use getLocale(): next/root-params não roda no cliente.
 */
export function usePathLocale(): Locale {
  return pathLocale(usePathname()) ?? defaultLocale;
}
