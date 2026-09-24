import { type NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE } from "@/i18n/locales";
import { localizePath, pathLocale } from "@/i18n/localize-path";
import { negotiateLocale } from "@/i18n/negotiate-locale";

/**
 * Proxy é o novo nome do middleware no Next 16: roda antes de qualquer
 * rota. Aqui ele só garante que toda URL tenha idioma, e "/" vira
 * "/pt-br" ou "/en". Ele não renderiza nada, então as páginas continuam
 * estáticas.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathLocale(pathname)) return NextResponse.next();

  const locale = negotiateLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });

  // clone() leva junto a query string (?utm_source=...).
  const url = request.nextUrl.clone();
  url.pathname = localizePath(pathname, locale);

  // redirect() usa 307 (temporário) por padrão, e precisa ser temporário:
  // o destino depende de quem visita. Um 301/308 ficaria guardado no
  // navegador e prenderia a pessoa no idioma antigo.
  return NextResponse.redirect(url);
}

export const config = {
  // Tudo, menos os arquivos internos do Next (_next) e caminhos com ponto
  // (imagens, robots.txt, sitemap.xml, manifest, ícones).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
