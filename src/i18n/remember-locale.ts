import { LOCALE_COOKIE, type Locale } from "./locales";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Grava a escolha de idioma no cookie que o proxy lê na próxima visita a
 * "/". Usa a Cookie Store API: o jeito novo de mexer em cookies, com
 * objeto e promessa em vez de montar a string de `document.cookie` na mão.
 *
 * Num navegador sem a API, a troca de idioma funciona igual; só não fica
 * lembrada. Por isso uma falha aqui é ignorada.
 */
export function rememberLocale(locale: Locale) {
  if (!("cookieStore" in window)) return;

  window.cookieStore
    .set({
      name: LOCALE_COOKIE,
      value: locale,
      path: "/",
      expires: Date.now() + ONE_YEAR_MS,
      sameSite: "lax",
    })
    .catch(() => undefined);
}
