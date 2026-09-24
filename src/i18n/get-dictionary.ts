import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { type Dictionary, dictionaries } from "./dictionaries";
import { hasLocale, type Locale } from "./locales";

// `lang` vem de next/root-params: o Next gera uma função para cada
// parâmetro dinâmico acima do layout raiz (aqui, o [lang] de app/[lang]).
// Qualquer server component chama e descobre o idioma da página atual,
// sem ninguém passar `lang` por props. Não roda em client components (o
// build acusa) nem em rotas de imagem, como a de Open Graph.

/** Idioma da página atual. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

/** Textos da página atual. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}
