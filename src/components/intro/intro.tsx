"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { createIntroTimeline } from "@/animations/intro-timeline";
import { useImagesReady } from "@/hooks/use-images-ready";
import { gsap, useGSAP } from "@/lib/gsap";
import { IntroDoneContext } from "./intro-done";
import { Preloader } from "./preloader";

const MOTION_QUERIES = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
  fullMotion: "(prefers-reduced-motion: no-preference)",
};

/**
 * Único componente client da intro: espera as imagens e dispara a timeline.
 * O conteúdo chega por `children`, então navbar e hero continuam sendo
 * server components.
 */
export function Intro({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const imagesReady = useImagesReady(root);
  const [introDone, setIntroDone] = useState(false);

  // useGSAP é o useEffect do GSAP: tudo criado aqui dentro é desfeito
  // sozinho quando o componente desmonta. `scope` limita os seletores
  // ao que está dentro de `root`.
  useGSAP(
    () => {
      if (!imagesReady) return;

      // matchMedia roda a função certa para a preferência de movimento
      // do sistema e refaz tudo se ela mudar.
      gsap.matchMedia().add(MOTION_QUERIES, (context) => {
        createIntroTimeline({
          reducedMotion: Boolean(context.conditions?.reducedMotion),
          onComplete: () => setIntroDone(true),
        });
      });
    },
    { scope: root, dependencies: [imagesReady] },
  );

  // Todo client component dentro de `children` (mesmo passando por
  // server components no meio) consegue ler `introDone` com useIntroDone().
  return (
    <div ref={root}>
      <Preloader />
      <IntroDoneContext value={introDone}>{children}</IntroDoneContext>
    </div>
  );
}
