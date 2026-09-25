import { gsap } from "@/lib/gsap";
import { PROJECTS, target } from "./projects-targets";
import { trackTravel } from "./track-travel";

/**
 * Labels da timeline, na ordem. O projects-focus.ts usa para descobrir
 * a posição de scroll de cada fase (labelToScroll).
 */
export const PHASE = {
  reveal: "reveal",
  rise: "rise",
  slide: "slide",
  slideEnd: "slide-end",
} as const;

/**
 * Tamanho do scroll da passagem inteira: INTRO_SCREENS alturas de tela
 * mais a distância que a fileira anda (ver o `end` abaixo). Quanto maior,
 * mais devagar tudo acontece.
 */
const INTRO_SCREENS = 1.5;

/**
 * Durações em "unidades" da timeline. Com scrub, o relógio não conta: a
 * timeline inteira é espalhada pelo scroll do `end`, e cada fase ganha uma
 * fatia do tamanho da sua duração. Aqui: reveal 1 + rise 0.92 (0.6 mais
 * 4 × 0.08 de stagger, com título e 4 cards) + slide 1 + respiro 0.15 =
 * 3.07. O slide fica com 1/3.07 do scroll: no desktop a fileira anda perto
 * de 1px por pixel rolado; no celular, onde ela anda mais, um pouco mais
 * rápido. Para mudar o ritmo de uma fase, mude a duração dela.
 */
const DURATION = { reveal: 1, rise: 0.6, stagger: 0.08, slide: 1, rest: 0.15 };

/**
 * Quanto a fileira anda, medido agora. offsetWidth é a largura de layout:
 * não muda com o transform que a própria animação aplica. clientWidth
 * não conta a barra de rolagem (window.innerWidth conta).
 */
export function measureTravel(stage: HTMLElement) {
  const track = stage.querySelector<HTMLElement>(target(PROJECTS.track));
  return track ? trackTravel(track.offsetWidth, stage.clientWidth) : 0;
}

/**
 * Monta a passagem do hero para os projetos, controlada pelo scroll:
 * reveal (o hero sai, o fundo novo entra) → rise (título e cards sobem)
 * → slide (a fileira anda na horizontal).
 *
 * Precisa rodar dentro de um gsap.matchMedia() (ou useGSAP): a timeline,
 * o ScrollTrigger e o pin entram no contexto e são desfeitos sozinhos.
 */
export function createProjectsScroll(stage: HTMLElement) {
  // selector: um querySelectorAll que só procura dentro do palco.
  const q = gsap.utils.selector(stage);
  const hero = q(target(PROJECTS.hero));
  const section = q(target(PROJECTS.section));
  const risers = [...q(target(PROJECTS.heading)), ...q(target(PROJECTS.card))];
  const track = q(target(PROJECTS.track));

  // Com `scrollTrigger` na timeline, quem move a agulha é o scroll, não
  // o relógio. Fica na timeline, nunca num tween de dentro dela.
  const tl = gsap.timeline({
    // "none" = velocidade constante. Os tweens que querem curva dizem.
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: stage,
      // pin: segura o palco na tela enquanto a timeline toca. O GSAP põe
      // o palco numa div nova (pin-spacer) com a altura do scroll, para a
      // página não "encolher" enquanto ele está fixo.
      pin: true,
      // "<ponto do palco> <ponto da tela>": começa quando o pé do palco
      // encosta no pé da tela. Com o hero da altura da tela, é o mesmo
      // que "top top"; com o hero mais alto (celular deitado), a pessoa
      // vê o hero inteiro antes do pin.
      start: "bottom bottom",
      // Função: é chamada de novo a cada refresh (resize, rotação), então
      // o tamanho acompanha a largura real da fileira.
      end: () =>
        `+=${window.innerHeight * INTRO_SCREENS + measureTravel(stage)}`,
      // scrub: a timeline segue o scroll. O número é o atraso suave, em
      // segundos, para alcançar o scroll (o "cinema"). Rolar para cima
      // desfaz tudo, sem código extra.
      scrub: 1,
      // Adianta o pin um pouquinho para não dar tranco quando ele engata.
      anticipatePin: 1,
      // No refresh, recalcula os valores em função (x, y, end).
      invalidateOnRefresh: true,
    },
  });

  // 1. reveal: o hero diminui e some; ao mesmo tempo ("<" = junto com o
  //    anterior) a seção de Projetos, dona do fundo novo, aparece.
  //    fromTo em tudo: com os dois lados escritos, um refresh no meio do
  //    caminho não muda o ponto de partida.
  tl.addLabel(PHASE.reveal)
    .fromTo(
      hero,
      { scale: 1, opacity: 1 },
      { scale: 0.75, opacity: 0, duration: DURATION.reveal, ease: "power1.in" },
    )
    .fromTo(
      section,
      { opacity: 0 },
      { opacity: 1, duration: DURATION.reveal, ease: "power1.out" },
      "<",
    )
    // Chave: no fim do reveal o hero invisível para de receber cliques
    // (senão um clique no vazio acertaria o "Ver projetos"). Duração 0 =
    // muda de uma vez naquele ponto; voltando o scroll, volta a "auto".
    // É um fromTo, e não um set, porque o set lembra o valor de antes na
    // primeira vez que roda, e depois de um refresh no meio do scroll ele
    // lembraria "none". immediateRender: false = não aplicar o "auto"
    // agora, só quando a agulha passar por aqui.
    .fromTo(
      hero,
      { pointerEvents: "auto" },
      { pointerEvents: "none", duration: 0, immediateRender: false },
    );

  // 2. rise: título e cards sobem de baixo da tela, um de cada vez
  //    (stagger). O y inicial é uma função: vale a altura da tela de
  //    agora, e o invalidateOnRefresh recalcula no resize.
  tl.addLabel(PHASE.rise).fromTo(
    risers,
    { y: () => window.innerHeight },
    {
      y: 0,
      duration: DURATION.rise,
      ease: "power2.out",
      stagger: DURATION.stagger,
    },
  );

  // 3. slide: a fileira anda até o último card encostar na margem direita.
  //    ease "none" (o padrão desta timeline): a fileira acompanha o scroll
  //    na mesma velocidade do começo ao fim.
  tl.addLabel(PHASE.slide)
    .fromTo(
      track,
      { x: 0 },
      { x: () => -measureTravel(stage), duration: DURATION.slide },
    )
    .addLabel(PHASE.slideEnd)
    // Respiro: um tween vazio. O último card para um instante antes de o
    // pin soltar.
    .to({}, { duration: DURATION.rest });

  return tl;
}
