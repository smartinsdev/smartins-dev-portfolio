export type HeroCardData = {
  src: string;
  /** Nome da área no grid-template-areas (ver hero-grid.module.css). */
  area: string;
  /** Some no celular, onde a grade tem só 2 colunas. */
  desktopOnly?: boolean;
};

// A ordem segue as colunas da esquerda para a direita: a timeline usa
// `stagger: { from: "edges" }`, então as colunas de fora entram primeiro.
export const heroCards: HeroCardData[] = [
  { src: "/hero/card-01.svg", area: "a" },
  { src: "/hero/card-02.svg", area: "b" },
  { src: "/hero/card-03.svg", area: "c" },
  { src: "/hero/card-04.svg", area: "d" },
  { src: "/hero/card-05.svg", area: "e" },
  { src: "/hero/card-06.svg", area: "f" },
  { src: "/hero/card-07.svg", area: "g", desktopOnly: true },
  { src: "/hero/card-08.svg", area: "h", desktopOnly: true },
];
