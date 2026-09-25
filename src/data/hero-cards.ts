export type HeroCardData = {
  /** Versão do tema escuro. */
  src: string;
  /**
   * Versão do tema claro: fundo branco e linhas mais suaves, para não
   * brigar com o subtítulo que fica por cima.
   */
  lightSrc: string;
  /** Nome da área no grid-template-areas (ver hero-grid.module.css). */
  area: string;
  /** Some no celular, onde a grade tem só 2 colunas. */
  desktopOnly?: boolean;
};

// A ordem segue as colunas da esquerda para a direita: a timeline usa
// `stagger: { from: "edges" }`, então as colunas de fora entram primeiro.
export const heroCards: HeroCardData[] = [
  { src: "/hero/card-01.svg", lightSrc: "/hero/card-01-light.svg", area: "a" },
  { src: "/hero/card-02.svg", lightSrc: "/hero/card-02-light.svg", area: "b" },
  { src: "/hero/card-03.svg", lightSrc: "/hero/card-03-light.svg", area: "c" },
  { src: "/hero/card-04.svg", lightSrc: "/hero/card-04-light.svg", area: "d" },
  { src: "/hero/card-05.svg", lightSrc: "/hero/card-05-light.svg", area: "e" },
  { src: "/hero/card-06.svg", lightSrc: "/hero/card-06-light.svg", area: "f" },
  {
    src: "/hero/card-07.svg",
    lightSrc: "/hero/card-07-light.svg",
    area: "g",
    desktopOnly: true,
  },
  {
    src: "/hero/card-08.svg",
    lightSrc: "/hero/card-08-light.svg",
    area: "h",
    desktopOnly: true,
  },
];
