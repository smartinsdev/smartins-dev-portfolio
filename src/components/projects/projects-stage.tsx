"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { createProjectsScroll } from "@/animations/projects-scroll";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Mesma condição da variante `cinema:` do globals.css. O CSS monta o
 * layout e o matchMedia liga a animação: os dois mudam juntos, até se a
 * pessoa mudar a preferência com a página aberta.
 */
const CINEMA_QUERY =
  "(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-width: 20rem) and ((min-height: 44.5rem) or ((min-width: 22.5rem) and (min-height: 41rem)) or ((min-width: 25.75rem) and (min-height: 40rem)))";

/**
 * Palco da passagem do hero para os projetos. Recebe as duas seções por
 * `children`, então elas continuam server components (igual ao <Intro>).
 */
export function ProjectsStage({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // matchMedia roda a função só enquanto a condição vale. Se ela
      // deixar de valer (ex.: a pessoa liga "reduzir movimento"), o GSAP
      // desfaz timeline, ScrollTrigger e pin sozinho.
      gsap.matchMedia().add(CINEMA_QUERY, () => {
        if (!stage.current) return;
        createProjectsScroll(stage.current);
      });
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
