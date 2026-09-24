import { gsap } from "@/lib/gsap";
import { INTRO, target } from "./intro-targets";

/** Quanto os cards começam afastados do centro (1 = a própria distância). */
const SPREAD = 0.6;

type IntroOptions = {
  reducedMotion: boolean;
  /** Chamado quando a última animação da intro termina. */
  onComplete?: () => void;
};

/**
 * Monta a sequência de entrada da home.
 *
 * Precisa rodar dentro do `useGSAP` com `scope`: é isso que faz os
 * seletores procurarem só dentro da intro, e não no documento inteiro.
 */
export function createIntroTimeline({
  reducedMotion,
  onComplete,
}: IntroOptions) {
  return reducedMotion
    ? createReducedTimeline(onComplete)
    : createFullTimeline(onComplete);
}

function createFullTimeline(onComplete?: () => void) {
  // `defaults` vale para todo tween da timeline que não disser o contrário.
  // expo.out: começa rápido e freia devagar, o que dá o peso "de cinema".
  // `onComplete` na timeline (e não num tween) só dispara quando TUDO
  // terminou, não importa qual animação acabe por último.
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete });

  // 0. Tira o preloader. autoAlpha = opacity + visibility: no fim fica
  //    `visibility: hidden` e ele para de bloquear cliques.
  tl.to(target(INTRO.preloader), {
    autoAlpha: 0,
    duration: 1,
    ease: "power2.inOut",
  });

  // Labels são marcos de tempo com nome. Posicionar tweens por label
  // deixa fácil ajustar: mudou o label, tudo que depende dele acompanha.
  tl.addLabel("enter", 0.6)
    .addLabel("title", "enter+=1")
    .addLabel("details", "title+=1");

  // 1. A grade "vem de fora": grande e escura -> tamanho final e clara.
  tl.fromTo(
    target(INTRO.grid),
    { autoAlpha: 0, scale: 1.25, filter: "brightness(0.35)" },
    {
      autoAlpha: 1,
      scale: 1,
      filter: "brightness(1)",
      duration: 2,
      ease: "power3.out",
    },
    "enter",
  );

  // Ao mesmo tempo ("enter" de novo), cada card converge para o lugar.
  // Valores em função: o GSAP chama a função para cada card, então cada
  // um começa a uma distância diferente, conforme a posição dele.
  tl.fromTo(
    target(INTRO.card),
    {
      autoAlpha: 0,
      x: (_index: number, card: Element) => outwardOffset(card, "x"),
      y: (_index: number, card: Element) => outwardOffset(card, "y"),
    },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      // power3.out em vez do expo.out padrão: o expo sai "disparado" no
      // primeiro instante; o power3 arranca mais macio e ainda freia no fim.
      duration: 2,
      ease: "power3.out",
      stagger: { each: 0.08, from: "edges" },
    },
    "enter",
  );

  // 2. Nome palavra por palavra, como o "VI" e depois o "grand theft auto":
  //    o stagger faz "Martins" entrar 0.3s depois de "Sinval".
  tl.fromTo(
    target(INTRO.titleWord),
    { autoAlpha: 0, scale: 1.15 },
    { autoAlpha: 1, scale: 1, duration: 1.2, stagger: 0.3 },
    "title",
  ).fromTo(
    target(INTRO.subtitle),
    { autoAlpha: 0, y: 16 },
    { autoAlpha: 1, y: 0, duration: 0.8 },
    "title+=0.65",
  );

  // 3. Linha de baixo em cascata: stagger atrasa cada item em 0.12s.
  tl.fromTo(
    target(INTRO.info),
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 },
    "details",
  );

  // 4. Navbar desce e a seta aparece junto ("<" = mesmo início do anterior).
  tl.fromTo(
    target(INTRO.nav),
    { autoAlpha: 0, y: -24 },
    { autoAlpha: 1, y: 0, duration: 0.9 },
    "details+=0.4",
  ).fromTo(
    target(INTRO.scrollHint),
    { autoAlpha: 0, y: -8 },
    { autoAlpha: 1, y: 0, duration: 0.9 },
    "<",
  );

  return tl;
}

/** Para quem pediu menos movimento no sistema: só um fade curto. */
function createReducedTimeline(onComplete?: () => void) {
  const content = [
    INTRO.grid,
    INTRO.card,
    INTRO.titleWord,
    INTRO.subtitle,
    INTRO.info,
    INTRO.nav,
    INTRO.scrollHint,
  ]
    .map(target)
    .join(",");

  return gsap
    .timeline({ onComplete })
    .to(target(INTRO.preloader), { autoAlpha: 0, duration: 0.3 })
    .fromTo(content, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");
}

/** Distância do centro do card até o centro da grade, ampliada por SPREAD. */
function outwardOffset(card: Element, axis: "x" | "y") {
  const grid = card.parentElement;
  if (!grid) return 0;

  const c = card.getBoundingClientRect();
  const g = grid.getBoundingClientRect();
  const distance =
    axis === "x"
      ? c.left + c.width / 2 - (g.left + g.width / 2)
      : c.top + c.height / 2 - (g.top + g.height / 2);

  return distance * SPREAD;
}
