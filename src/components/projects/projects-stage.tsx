"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { followFocus, linkToProjects } from "@/animations/projects-focus";
import { createProjectsScroll } from "@/animations/projects-scroll";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Mesma condição da variante `cinema:` do globals.css. O CSS monta o
 * layout e o matchMedia liga a animação: os dois mudam juntos, até se a
 * pessoa mudar a preferência com a página aberta.
 */
const CINEMA_QUERY =
  "(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-width: 20rem) and ((min-height: 44.5rem) or ((min-width: 22.5rem) and (min-height: 41rem)) or ((min-width: 25.75rem) and (min-height: 40rem)))";

// Scroll de quando o palco foi desmontado (troca de idioma: a página é
// montada de novo sem recarregar). Variável de módulo, então sobrevive.
let scrollBeforeUnmount: number | null = null;

/**
 * Palco da passagem do hero para os projetos. Recebe as duas seções por
 * `children`, então elas continuam server components (igual ao <Intro>).
 */
export function ProjectsStage({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Declarado antes do useGSAP de propósito: na desmontagem, o React
  // roda as limpezas na ordem em que os efeitos foram declarados, então
  // esta guarda o scroll antes de o GSAP desfazer o pin.
  useLayoutEffect(
    () => () => {
      scrollBeforeUnmount = window.scrollY;
    },
    [],
  );

  useGSAP(
    () => {
      // matchMedia roda a função só enquanto a condição vale. Se ela
      // deixar de valer (ex.: a pessoa liga "reduzir movimento"), o GSAP
      // desfaz timeline, ScrollTrigger e pin sozinho.
      gsap.matchMedia().add(CINEMA_QUERY, () => {
        if (!stage.current) return;
        const tl = createProjectsScroll(stage.current);
        const stopLinks = linkToProjects(stage.current, tl);
        const stopFocus = followFocus(stage.current, tl);

        // Palco novo depois da troca de idioma: volta ao ponto em que a
        // pessoa estava.
        const st = tl.scrollTrigger;
        if (scrollBeforeUnmount !== null && st) {
          const top = scrollBeforeUnmount;
          scrollBeforeUnmount = null;
          // ScrollTrigger.refresh(): mede tudo agora (start, end e a altura
          // do pin-spacer). Sem isso, a página ainda estaria curta e o
          // scrollTo pararia no 0. E tem que ser o refresh geral, e não só
          // o deste ScrollTrigger: o palco antigo acabou de ser desfeito, e
          // o próximo refresh geral (que o GSAP já deixou na fila) rolaria
          // para o 0 sem voltar. Este cancela o da fila.
          ScrollTrigger.refresh();
          // progress põe a agulha na fração certa na hora (normalize: onde
          // o scroll cai entre o start e o end, de 0 a 1; clamp: nunca fora
          // disso), para o scrub não reprisar o caminho.
          tl.progress(
            gsap.utils.clamp(0, 1, gsap.utils.normalize(st.start, st.end, top)),
          );
          window.scrollTo({ top, behavior: "instant" });
        }

        // Os listeners não são do GSAP: a função devolvida é a limpeza
        // deles, e o matchMedia chama quando desfaz tudo.
        return () => {
          stopLinks();
          stopFocus();
        };
      });
      // O add() acima roda na hora quando a condição vale, e aí já usou o
      // scroll guardado. Se não valia (layout estático), o valor não
      // serve mais: sem isto, ligar o modo cinema depois (desligando
      // "reduzir movimento") pularia para um scroll antigo.
      scrollBeforeUnmount = null;
    },
    { scope: wrapper },
  );

  return (
    // O pin põe o palco dentro de uma div nova (pin-spacer). O React só
    // tira e põe esta div de fora; o que muda dentro dela é por conta do
    // GSAP, que desfaz o embrulho quando o componente desmonta.
    <div ref={wrapper}>
      {/* No modo cinema: grid com as duas seções na mesma célula
          (col-start-1 + row-start-1 em cada filho), ou seja, uma em cima
          da outra; Projetos vem depois no HTML e fica por cima.
          grid-cols-[minmax(0,1fr)]: a coluna tem a largura do palco. Sem
          isso, ela cresceria até a largura da fileira (w-max) e levaria o
          hero junto, descentralizado.
          overflow-clip corta o que sai do palco (cards abaixo e à direita)
          sem criar barra de rolagem. */}
      <div
        ref={stage}
        className="cinema:grid cinema:grid-cols-[minmax(0,1fr)] cinema:overflow-clip cinema:*:col-start-1 cinema:*:row-start-1"
      >
        {children}
      </div>
    </div>
  );
}
