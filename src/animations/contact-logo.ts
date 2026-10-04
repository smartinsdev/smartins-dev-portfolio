import { gsap } from "@/lib/gsap";
import { createLogoDraw } from "./logo-draw";

/**
 * Desenha a logo do fim da página enquanto a pessoa rola até lá. É o
 * mesmo desenho do preloader (createLogoDraw): o site abre e fecha com o
 * mesmo traço.
 *
 * `logo` é o seletor do <svg>. Precisa rodar dentro de um
 * gsap.matchMedia() (ou useGSAP): a timeline e o ScrollTrigger entram no
 * contexto e são desfeitos sozinhos.
 */
export function createContactLogoScroll(logo: string) {
  // O ScrollTrigger fica na timeline de fora, nunca nas de dentro: a do
  // desenho entra pelo add() e passa a andar junto com esta.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: logo,
      // Começa quando o topo da logo aparece no pé da tela...
      start: "top bottom",
      // ...e termina no fim da página. "max" é o maior scroll possível:
      // a logo fica pronta exatamente quando a pessoa chega ao fim.
      end: "max",
      // Igual aos Projetos: o desenho segue o scroll com 1s de atraso
      // suave, e rolar para cima apaga o traço de volta.
      scrub: 1,
      // A ordem de refresh importa: este ScrollTrigger fica abaixo do pin
      // dos Projetos, e só dá para medir o lugar dele depois que o pin
      // criou o espaço que ocupa. Quem tem o número maior é medido
      // primeiro (o pin tem 0, o padrão). Sem isto, a ordem seria a de
      // criação, e o pin é criado de novo, por último, quando o layout
      // troca (ex.: a pessoa desliga "reduzir movimento"). Efeito
      // colateral bom: com um refreshPriority definido, o GSAP passa a
      // ordenar todos os ScrollTriggers pela posição na página.
      refreshPriority: -1,
    },
  });

  tl.add(createLogoDraw(logo));
  return tl;
}
