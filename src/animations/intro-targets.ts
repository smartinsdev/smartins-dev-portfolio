/**
 * Nomes dos elementos que a intro anima.
 *
 * Os componentes marcam o elemento com `data-intro={INTRO.x}` e a timeline
 * encontra com `target(INTRO.x)`. Assim o nome existe num lugar só.
 */
export const INTRO = {
  preloader: "preloader",
  grid: "grid",
  card: "card",
  titleWord: "title-word",
  subtitle: "subtitle",
  info: "info",
  nav: "nav",
  scrollHint: "scroll-hint",
} as const;

export type IntroTarget = (typeof INTRO)[keyof typeof INTRO];

export const target = (name: IntroTarget) => `[data-intro="${name}"]`;
