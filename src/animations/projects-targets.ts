/**
 * Nomes dos elementos que a animação de scroll dos projetos mexe.
 *
 * Mesmo padrão do intro-targets.ts: os componentes marcam o elemento
 * com `data-projects={PROJECTS.x}` e a animação encontra com
 * `target(PROJECTS.x)`. Assim o nome existe num lugar só.
 */
export const PROJECTS = {
  /** A <section> do hero: diminui e some. */
  hero: "hero",
  /** A <section> de Projetos: dona do fundo novo. */
  section: "section",
  /** Título "Projetos" com a contagem. */
  heading: "heading",
  /** A fileira (<ol>) que anda na horizontal. */
  track: "track",
  card: "card",
} as const;

/**
 * Classe que o palco ganha enquanto está fixado na tela (pin). A variante
 * `stage-pinned:` do globals.css procura por ela: o CSS não importa
 * TypeScript, então o nome existe nos dois lugares, e o
 * projects-targets.test.ts confere que são iguais.
 */
export const PINNED_CLASS = "projects-pinned";

export type ProjectsTarget = (typeof PROJECTS)[keyof typeof PROJECTS];

export const target = (name: ProjectsTarget) => `[data-projects="${name}"]`;
