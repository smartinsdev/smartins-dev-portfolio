import { Flip, gsap } from "@/lib/gsap";
import { INTRO, target } from "./intro-targets";
import { createLogoDraw } from "./logo-draw";

/** Quanto os cards começam afastados do centro (1 = a própria distância). */
const SPREAD = 0.6;

/** Label onde a intro espera as imagens. Quem libera é releaseIntro(). */
const WAIT = "wait";

type IntroOptions = {
  reducedMotion: boolean;
  /** Chamado quando a última animação da intro termina. */
  onComplete?: () => void;
};

/**
 * Monta a sequência de entrada da home.
 *
 * A timeline começa a tocar na hora, mas para no label WAIT até alguém
 * chamar releaseIntro() (o <Intro> chama quando as imagens carregam).
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

/**
 * Deixa a intro passar do ponto de espera. Se ela ainda não chegou lá,
 * segue direto sem parar; se já estava parada esperando, volta a andar.
 */
export function releaseIntro(tl: gsap.core.Timeline) {
  tl.removePause(WAIT);
  tl.play();
}

function createFullTimeline(onComplete?: () => void) {
  const preloaderLogo = target(INTRO.preloaderLogo);

  // `defaults` vale para todo tween da timeline que não disser o contrário.
  // expo.out: começa rápido e freia devagar, o que dá o peso "de cinema".
  // `onComplete` na timeline (e não num tween) só dispara quando TUDO
  // terminou, não importa qual animação acabe por último.
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete });

  // 0. A logo é desenhada no centro. O CSS esconde ela até aqui, para
  //    não aparecer inteira por um instante antes do desenho começar.
  //    add() encaixa a timeline do desenho dentro desta.
  tl.set(preloaderLogo, { autoAlpha: 1 }).add(createLogoDraw(preloaderLogo));

  // Labels são marcos de tempo com nome. Posicionar tweens por label
  // deixa fácil ajustar: mudou o label, tudo que depende dele acompanha.
  // "+=0.25" = 0.25s depois do fim do desenho, com a logo pronta na tela.
  tl.addLabel(WAIT, "+=0.25")
    .addLabel("fly", WAIT)
    .addLabel("enter", "fly+=0.5")
    .addLabel("title", "enter+=1")
    .addLabel("details", "title+=1");

  // addPause: quando a agulha chega no WAIT, a timeline se pausa sozinha.
  // releaseIntro() tira essa pausa quando as imagens estiverem prontas.
  tl.addPause(WAIT);

  // 1. A logo voa até a da navbar. Flip.fit mede as duas e anima a do
  //    preloader (x, y e escala) até ficar exatamente em cima da outra.
  //    Ele mede no momento em que é chamado, ou seja, quando a timeline é
  //    montada. Por isso nada acima da logo da navbar pode estar deslocado
  //    nessa hora (é o motivo de o <header> não ser mais animado).
  tl.add(
    Flip.fit(preloaderLogo, target(INTRO.navLogo), {
      scale: true,
      duration: 1.2,
      ease: "power3.inOut",
    }) as gsap.core.Tween,
    "fly",
  );

  // Pousou: troca uma logo pela outra no mesmo instante. Como estão no
  // mesmo lugar e do mesmo tamanho, a troca não aparece.
  // ">" = no fim do anterior (o voo); "<" = junto com o anterior.
  tl.set(target(INTRO.navLogo), { autoAlpha: 1 }, ">").set(
    preloaderLogo,
    { autoAlpha: 0 },
    "<",
  );

  // Enquanto a logo voa, o fundo do preloader some. autoAlpha = opacity +
  // visibility: no fim fica `visibility: hidden` e para de bloquear cliques.
  tl.to(
    target(INTRO.preloader),
    { autoAlpha: 0, duration: 1, ease: "power2.inOut" },
    "fly",
  );

  // 2. A grade "vem de fora": grande e escura -> tamanho final e clara.
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

  // 3. Nome palavra por palavra, como o "VI" e depois o "grand theft auto":
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

  // 4. Linha de baixo em cascata: stagger atrasa cada item em 0.12s.
  tl.fromTo(
    target(INTRO.info),
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 },
    "details",
  );

  // 5. Links da navbar descem (a logo já chegou voando) e a seta aparece
  //    junto ("<" = mesmo início do anterior).
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

/**
 * Para quem pediu menos movimento no sistema: a logo aparece parada,
 * espera as imagens e tudo troca com um fade curto.
 */
function createReducedTimeline(onComplete?: () => void) {
  const preloader = [INTRO.preloader, INTRO.preloaderLogo]
    .map(target)
    .join(",");
  const content = [
    INTRO.grid,
    INTRO.card,
    INTRO.titleWord,
    INTRO.subtitle,
    INTRO.info,
    INTRO.nav,
    INTRO.navLogo,
    INTRO.scrollHint,
  ]
    .map(target)
    .join(",");

  // A espera fica depois do fade da logo, e não no tempo 0: o GSAP só
  // para numa pausa que a agulha atravessa, e ela nunca "atravessa" o 0.
  return gsap
    .timeline({ onComplete })
    .fromTo(
      target(INTRO.preloaderLogo),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 },
    )
    .addLabel(WAIT)
    .addPause(WAIT)
    .to(preloader, { autoAlpha: 0, duration: 0.3 }, WAIT)
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
