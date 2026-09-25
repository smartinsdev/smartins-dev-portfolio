import { gsap } from "@/lib/gsap";
import { isPlainClick } from "@/lib/is-plain-click";
import { measureTravel, PHASE } from "./projects-scroll";
import { PROJECTS, target } from "./projects-targets";
import { cardProgress } from "./track-travel";

const HASH = "#projects";

// Variável de módulo: sobrevive à troca de idioma, que monta a página de
// novo sem recarregar. O endereço de chegada (digitado ou de um link de
// fora) é lido uma vez só, no "load"; depois da troca de idioma, mesmo
// com #projects na URL, a página fica onde estava.
let initialHashHandled = false;

/**
 * No modo cinema, a seção de Projetos fica em cima do hero, no topo do
 * palco: o pulo normal da âncora #projects iria para o topo da página e
 * nada aconteceria. Aqui, os links para #projects e o #projects no
 * endereço levam ao ponto em que os cards acabaram de chegar.
 *
 * Devolve a limpeza dos listeners.
 */
export function linkToProjects(stage: HTMLElement, tl: gsap.core.Timeline) {
  const st = tl.scrollTrigger;
  const title = stage.querySelector<HTMLElement>(
    `${target(PROJECTS.heading)} h2`,
  );
  if (!st || !title) return () => {};

  // labelToScroll: a posição de scroll (em px) em que a agulha passa
  // pelo label. É o scroll que corresponde ao começo do slide.
  const cardsTop = () => st.labelToScroll(PHASE.slide);

  // Um listener só no documento pega todos os links para #projects (o da
  // navbar e o "Ver projetos"): o clique "sobe" até o document.
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || !isPlainClick(event)) return;
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(`a[href="${HASH}"]`)) return;

    event.preventDefault();
    // O que a âncora faria: o #projects na URL (e no histórico)...
    history.pushState(null, "", HASH);
    // ...e o foco na seção, para quem usa teclado ou leitor de tela.
    // preventScroll: quem rola é a linha de baixo, com animação.
    title.focus({ preventScroll: true });
    // Saindo do topo, a rolagem suave passa pela transição inteira.
    window.scrollTo({ top: cardsTop(), behavior: "smooth" });
  };
  document.addEventListener("click", onClick);

  // Chegou com #projects no endereço: vai direto para os cards. Espera o
  // "load" porque o ScrollTrigger refaz as medidas nessa hora. A marca de
  // "já li o endereço" só muda quando a leitura acontece de verdade: em
  // desenvolvimento, o React monta e desmonta os efeitos uma vez a mais
  // (StrictMode), e a limpeza tira o listener antes do "load".
  const handleInitialHash = () => {
    initialHashHandled = true;
    if (location.hash !== HASH) return;
    // seek: põe a agulha no label na hora. Sem isso, o scrub levaria 1s
    // para alcançar o scroll e a pessoa veria a transição passar.
    tl.seek(PHASE.slide);
    window.scrollTo({ top: cardsTop(), behavior: "instant" });
  };
  if (!initialHashHandled) {
    if (document.readyState === "complete") handleInitialHash();
    else window.addEventListener("load", handleInitialHash, { once: true });
  }

  return () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("load", handleInitialHash);
  };
}

/**
 * Leva a página até o que recebeu o foco pelo teclado. O overflow: clip
 * do palco impede o navegador de rolar para o lado sozinho: sem isto, o
 * Tab iria para um card fora da tela.
 *
 * Devolve a limpeza do listener.
 */
export function followFocus(stage: HTMLElement, tl: gsap.core.Timeline) {
  const st = tl.scrollTrigger;
  const hero = stage.querySelector(target(PROJECTS.hero));
  // toArray com escopo: os cards de dentro do palco, como array.
  const cards = gsap.utils.toArray<HTMLElement>(target(PROJECTS.card), stage);
  if (!st || !hero || cards.length === 0) return () => {};

  const onFocusIn = (event: FocusEvent) => {
    const element = event.target;
    // Só foco de teclado (:focus-visible). O clique do mouse também foca
    // o link, e a página não pode pular antes de ele abrir.
    if (!(element instanceof Element) || !element.matches(":focus-visible")) {
      return;
    }

    // Voltou para o hero (Shift+Tab): volta para antes do reveal.
    if (hero.contains(element)) {
      if (window.scrollY > st.start) {
        window.scrollTo({ top: st.start, behavior: "instant" });
      }
      return;
    }

    const card = element.closest<HTMLElement>(target(PROJECTS.card));
    if (!card) return;

    // offsetLeft: onde o card está dentro da fileira, sem contar o
    // transform. O primeiro card começa na margem.
    const progress = cardProgress(
      card.offsetLeft,
      cards[0].offsetLeft,
      measureTravel(stage),
    );
    // interpolate: o ponto entre o começo e o fim do slide que corresponde
    // ao progresso (0 = começo, 1 = fim). O scrub anima o caminho.
    const top = gsap.utils.interpolate(
      st.labelToScroll(PHASE.slide),
      st.labelToScroll(PHASE.slideEnd),
      progress,
    );
    window.scrollTo({ top, behavior: "instant" });
  };

  stage.addEventListener("focusin", onFocusIn);
  return () => stage.removeEventListener("focusin", onFocusIn);
}
