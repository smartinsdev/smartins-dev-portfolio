import { hasLocale, type Locale } from "./locales.ts";

/** Idioma no começo do caminho: "/en/x" -> "en"; "/english" -> undefined. */
export function pathLocale(pathname: string): Locale | undefined {
  // "/en/x".split("/") = ["", "en", "x"]: o primeiro segmento é o [1].
  const first = pathname.split("/")[1] ?? "";
  return hasLocale(first) ? first : undefined;
}

/** Troca (ou acrescenta) o idioma no começo do caminho: "/pt-br/x" -> "/en/x". */
export function localizePath(pathname: string, locale: Locale): string {
  const current = pathLocale(pathname);
  // Tira "/pt-br" do começo, se tiver. Sobra "" (era a home), "/" ou "/x".
  const rest = current ? pathname.slice(current.length + 1) : pathname;
  return rest === "" || rest === "/" ? `/${locale}` : `/${locale}${rest}`;
}
