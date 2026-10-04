import { gsap, ScrollTrigger } from "@/lib/gsap";
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
 * endereço levam ao ponto em que os cards acabaram de chegar. Uma âncora
 * de seção depois do palco (#contact) no endereço também é refeita,
 * porque o pin empurra a seção para baixo.
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
    // O que a âncora faria: o #projects na URL (e no histórico)... Só se
    // ainda não estiver lá: a âncora de verdade também não repete a
    // entrada, e o "Voltar" tem que sair de #projects na primeira vez.
    if (location.hash !== HASH) history.pushState(null, "", HASH);
    // ...e o foco na seção, para quem usa teclado ou leitor de tela.
    // preventScroll: quem rola é a linha de baixo, com animação.
    title.focus({ preventScroll: true });
    // Saindo do topo, a rolagem suave passa pela transição inteira.
    window.scrollTo({ top: cardsTop(), behavior: "smooth" });
  };
  document.addEventListener("click", onClick);

  // Chegou com uma âncora no endereço. Espera o "load" porque o
  // ScrollTrigger refaz as medidas nessa hora. A marca de "já li o
  // endereço" só muda quando a leitura acontece de verdade: em
  // desenvolvimento, o React monta e desmonta os efeitos uma vez a mais
  // (StrictMode), e a limpeza tira o listener antes do "load".
  const handleInitialHash = () => {
    initialHashHandled = true;
    if (location.hash === HASH) {
      // #projects: vai direto para os cards. seek põe a agulha no label na
      // hora. Sem isso, o scrub levaria 1s para alcançar o scroll e a
      // pessoa veria a transição passar.
      tl.seek(PHASE.slide);
      window.scrollTo({ top: cardsTop(), behavior: "instant" });
      return;
    }
    // Âncora de uma seção depois do palco (ex.: #contact). O navegador
    // pulou até ela antes de o pin existir; quando o pin cria o espaço
    // dele, a seção desce, e a pessoa ficaria no meio da passagem dos
    // Projetos. Aqui ela vai de novo até a seção, já no lugar certo.
    // Sem decodeURIComponent: os ids do site são ASCII, e ele lançaria
    // erro com um endereço malformado (ex.: "#%").
    const anchor = location.hash
      ? document.getElementById(location.hash.slice(1))
      : null;
    if (anchor && !stage.contains(anchor)) {
      // Quando a página já carregou antes de o React montar o palco (o
      // comum em produção), isto roda logo depois de o pin ser criado, e o
      // GSAP ainda não mediu o espaço dele: a primeira medida fica para o
      // próximo quadro. refresh() mede tudo agora, como na troca de idioma
      // (projects-stage.tsx).
      ScrollTrigger.refresh();
      anchor.scrollIntoView({ block: "start", behavior: "instant" });
    }
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
 * Devolve a limpeza dos listeners.
 */
export function followFocus(stage: HTMLElement, tl: gsap.core.Timeline) {
  const st = tl.scrollTrigger;
  const hero = stage.querySelector(target(PROJECTS.hero));
  // toArray com escopo: os cards de dentro do palco, como array.
  const cards = gsap.utils.toArray<HTMLElement>(target(PROJECTS.card), stage);
  if (!st || !hero || cards.length === 0) return () => {};

  // Ao sair da janela (outra aba, Alt+Tab), o foco "sai" e, na volta,
  // "entra" de novo no mesmo elemento. Esse retorno não pode rolar a
  // página: a pessoa pode ter rolado para longe do elemento (Espaço,
  // PageDown) antes de sair.
  let returningTo: Element | null = null;
  const onWindowBlur = () => {
    returningTo = document.activeElement;
  };

  const onFocusIn = (event: FocusEvent) => {
    const element = event.target;
    const isReturn = element === returningTo;
    returningTo = null;
    if (isReturn) return;
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

  window.addEventListener("blur", onWindowBlur);
  stage.addEventListener("focusin", onFocusIn);
  return () => {
    window.removeEventListener("blur", onWindowBlur);
    stage.removeEventListener("focusin", onFocusIn);
  };
}
