"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { speedUpOnInput } from "@/animations/intro-skip";
import { createIntroTimeline, releaseIntro } from "@/animations/intro-timeline";
import { useImagesReady } from "@/hooks/use-images-ready";
import { gsap, useGSAP } from "@/lib/gsap";
import { IntroDoneContext } from "./intro-done";
import { Preloader } from "./preloader";

const MOTION_QUERIES = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
  fullMotion: "(prefers-reduced-motion: no-preference)",
};

/**
 * Único componente client da intro: dispara a timeline e libera ela
 * quando as imagens carregam. O conteúdo chega por `children`, então
 * navbar e hero continuam sendo server components.
 */
export function Intro({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const imagesLoaded = useRef(false);
  const imagesReady = useImagesReady(root);
  const [introDone, setIntroDone] = useState(false);

  // useGSAP é o useEffect do GSAP: tudo criado aqui dentro é desfeito
  // sozinho quando o componente desmonta. `scope` limita os seletores
  // ao que está dentro de `root`.
  //
  // A timeline nasce junto com a página, sem esperar as imagens, para a
  // logo começar a ser desenhada na hora. Ela mesma para no ponto de
  // espera até o efeito de baixo liberar.
  useGSAP(
    () => {
      // matchMedia roda a função certa para a preferência de movimento
      // do sistema e refaz tudo se ela mudar.
      gsap.matchMedia().add(MOTION_QUERIES, (context) => {
        const tl = createIntroTimeline({
          reducedMotion: Boolean(context.conditions?.reducedMotion),
          onComplete: () => setIntroDone(true),
        });

        // Se a preferência mudar depois de as imagens carregarem, a
        // timeline nova não pode ficar parada esperando por elas.
        if (imagesLoaded.current) releaseIntro(tl);
        timeline.current = tl;

        // Clicar, tocar, rolar ou apertar uma tecla acelera o resto da
        // intro. A função devolvida aqui é a limpeza: o matchMedia chama
        // ela quando desfaz tudo (ao desmontar ou mudar a preferência).
        return speedUpOnInput(tl);
      });
    },
    { scope: root },
  );

  // Não cria animação nenhuma, só manda a timeline seguir: por isso é
  // um useEffect comum e não um useGSAP.
  useEffect(() => {
    if (!imagesReady) return;

    imagesLoaded.current = true;
    if (timeline.current) releaseIntro(timeline.current);
  }, [imagesReady]);

  // Todo client component dentro de `children` (mesmo passando por
  // server components no meio) consegue ler `introDone` com useIntroDone().
  return (
    <div ref={root}>
      <Preloader />
      <IntroDoneContext value={introDone}>{children}</IntroDoneContext>
    </div>
  );
}
