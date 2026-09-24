import { defaultLocale, hasLocale, type Locale } from "./locales.ts";

type NegotiateInput = {
  /** Valor do cookie `locale`, se existir. */
  cookie?: string;
  /** Cabeçalho Accept-Language, ex.: "pt-BR,pt;q=0.9,en;q=0.8". */
  acceptLanguage?: string | null;
};

// Código principal -> idioma do site: "pt-BR" e "pt-PT" começam com "pt".
// Map, e não objeto: num objeto, um cabeçalho com "constructor" acharia
// a função herdada de Object e devolveria lixo.
const SUPPORTED = new Map<string, Locale>([
  ["pt", "pt-br"],
  ["en", "en"],
]);

/**
 * Escolhe o idioma de quem chegou sem idioma na URL: primeiro a escolha
 * salva no cookie, depois o idioma do navegador, por fim o padrão.
 */
export function negotiateLocale({
  cookie,
  acceptLanguage,
}: NegotiateInput): Locale {
  if (cookie && hasLocale(cookie)) return cookie;

  for (const tag of preferredLanguages(acceptLanguage ?? "")) {
    const locale = SUPPORTED.get(tag.split("-")[0]);
    if (locale) return locale;
  }

  return defaultLocale;
}

/**
 * "en;q=0.5, pt-BR" -> ["pt-br", "en"]: do mais preferido para o menos.
 * `q` é o peso de cada idioma (0 a 1, padrão 1); q=0 quer dizer "não".
 */
function preferredLanguages(header: string): string[] {
  return (
    header
      .split(",")
      .map((part, index) => {
        const [tag = "", ...params] = part.split(";");
        const q = params
          .map((param) => param.trim())
          .find((param) => param.startsWith("q="));
        const weight = q === undefined ? 1 : Number(q.slice(2));

        return {
          tag: tag.trim().toLowerCase(),
          weight: Number.isNaN(weight) ? 0 : weight,
          index,
        };
      })
      .filter(({ tag, weight }) => tag !== "" && weight > 0)
      // Maior peso primeiro; no empate, vale a ordem do cabeçalho.
      .sort((a, b) => b.weight - a.weight || a.index - b.index)
      .map(({ tag }) => tag)
  );
}
