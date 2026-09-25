/**
 * Quando a seção de Projetos usa o modo cinema: a mesma condição da
 * variante `cinema:` do globals.css. O CSS monta o layout e o
 * gsap.matchMedia liga a animação: os dois mudam juntos, até se a pessoa
 * mudar a preferência com a página aberta.
 *
 * O CSS não importa TypeScript, então a condição existe nos dois lugares.
 * O cinema-query.test.ts compara os dois: se um mudar sem o outro, o
 * `pnpm test` falha. Sem isso, o CSS poderia pôr a seção em cima do hero
 * sem o GSAP criar o pin, e os cards ficariam inalcançáveis.
 */
export const CINEMA_QUERY =
  "(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-width: 20rem) and ((min-height: 44.5rem) or ((min-width: 22.5rem) and (min-height: 41rem)) or ((min-width: 25.75rem) and (min-height: 40rem)))";
