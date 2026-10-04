"use client";

import { useRef } from "react";
import { createContactLogoScroll } from "@/animations/contact-logo";
import { Logo } from "@/components/ui/logo";
import { gsap, useGSAP } from "@/lib/gsap";

/** Único na página: a logo da navbar usa "navbar-logo". */
const LOGO_ID = "contact-logo";

/**
 * A logo grande do fim do Contato, desenhada pelo scroll.
 *
 * O HTML já vem com a logo inteira: sem JavaScript, ou com "reduzir
 * movimento", ela fica assim, parada. O desenho só existe quando o
 * matchMedia abaixo vale.
 */
export function ContactLogo() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Se a pessoa ligar "reduzir movimento" com a página aberta, o
      // matchMedia desfaz o ScrollTrigger e a logo volta a ficar inteira.
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        createContactLogoScroll(`#${LOGO_ID}`);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Altura em min(vw, svh): encolhe numa tela baixa, junto com o
          resto do Contato (ver contact.tsx). */}
      <Logo
        id={LOGO_ID}
        className="h-[clamp(4rem,min(11vw,14svh),9rem)] w-auto"
      />
    </div>
  );
}
