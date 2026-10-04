import { ScrollTrigger } from "@/lib/gsap";
import { PHASE } from "./projects-scroll";
import { PROJECTS, target } from "./projects-targets";

/**
 * Em que parte da página a pessoa está. Depois do palco (o Contato), o
 * lugar guarda também quanto ela já tinha passado do fim do palco.
 */
type Place =
  | { part: "hero" }
  | { part: "projects" }
  | { part: "after"; pastStage: number };
type Layout = "cinema" | "static";

/**
 * Quando o layout troca no meio da página (girar o celular, ligar ou
 * desligar "reduzir movimento", mudar a altura da janela), leva a pessoa
 * de volta à mesma parte: o hero, os projetos ou o que vem depois do palco.
 *
 * Sem isto ela voltaria ao topo. Na troca, o GSAP desfaz o pin, a página
 * encolhe, e a posição que ele guardou para devolver depois se perde
 * junto com o ScrollTrigger antigo.
 *
 * @param area a div em volta do palco: no modo cinema, o pin-spacer fica
 *   dentro dela, então o pé dela é o fim do palco nos dois layouts
 * @param cinemaQuery a mesma condição da variante `cinema:` do CSS
 * @param cinema a timeline do modo cinema, enquanto ele está montado
 * Devolve a limpeza dos listeners.
 */
export function keepPlaceAcrossLayouts(
  area: HTMLElement,
  stage: HTMLElement,
  cinemaQuery: string,
  cinema: () => gsap.core.Timeline | null,
) {
  const section = stage.querySelector<HTMLElement>(target(PROJECTS.section));
  if (!section) return () => {};
  const media = window.matchMedia(cinemaQuery);

  let place: Place = { part: "hero" };
  // Em que layout o `place` foi medido.
  let measuredIn: Layout = cinema() ? "cinema" : "static";

  // Guarda o lugar a cada rolagem, mas só quando o CSS e o GSAP estão no
  // mesmo layout. No meio de uma troca, o CSS já mudou e o GSAP ainda não:
  // a medida sairia errada.
  const onScroll = () => {
    const tl = cinema();
    if (media.matches !== Boolean(tl)) return;
    const st = tl?.scrollTrigger;
    measuredIn = st ? "cinema" : "static";

    // O fim do palco já passou da metade de cima da tela: a pessoa está
    // no que vem depois. pastStage: quanto o fim do palco está acima do
    // topo da tela (negativo se ele ainda aparece).
    const stageEnd = area.getBoundingClientRect().bottom;
    if (stageEnd < window.innerHeight / 2) {
      place = { part: "after", pastStage: -stageEnd };
    } else if (st) {
      // Do rise em diante, os cards já estão entrando: "projetos".
      place = {
        part:
          window.scrollY >= st.labelToScroll(PHASE.rise) ? "projects" : "hero",
      };
    } else {
      const top = section.getBoundingClientRect().top;
      place = { part: top < window.innerHeight / 2 ? "projects" : "hero" };
    }
  };

  // O GSAP avisa "matchMedia" depois de trocar e de medir tudo de novo:
  // é a hora de pôr a pessoa no lugar.
  const onMediaChange = () => {
    const tl = cinema();
    const layout: Layout = tl ? "cinema" : "static";
    // Mudou outra condição (ex.: a orientação), mas o layout é o mesmo.
    if (layout === measuredIn) return;
    measuredIn = layout;

    if (place.part === "after") {
      // O mesmo tanto depois do fim do palco, que agora está em outro
      // lugar (o pin-spacer apareceu ou sumiu).
      const stageEnd = area.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top: stageEnd + place.pastStage, behavior: "instant" });
    } else if (place.part === "hero") {
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (tl?.scrollTrigger) {
      // O mesmo ponto da âncora #projects: os cards acabaram de chegar.
      tl.seek(PHASE.slide);
      window.scrollTo({
        top: tl.scrollTrigger.labelToScroll(PHASE.slide),
        behavior: "instant",
      });
    } else {
      section.scrollIntoView({ block: "start", behavior: "instant" });
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  ScrollTrigger.addEventListener("matchMedia", onMediaChange);
  return () => {
    window.removeEventListener("scroll", onScroll);
    ScrollTrigger.removeEventListener("matchMedia", onMediaChange);
  };
}
