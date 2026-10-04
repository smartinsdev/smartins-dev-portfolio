"use client";

import { useScrolled } from "@/hooks/use-scrolled";

/**
 * Fundo da navbar, que aparece aos poucos quando a página sai do topo.
 *
 * A navbar é fixa e transparente. Quando algo rola por baixo dela (os
 * cards no layout estático de Projetos, o Contato depois do palco), o
 * texto dos links se mistura com o da página, e o fundo resolve.
 *
 * No modo cinema, enquanto o palco está fixado (pin), nada rola por baixo:
 * o fundo some (stage-pinned:opacity-0) e o hero e os Projetos ficam como
 * sempre foram. Ele volta quando o pin solta e o Contato começa a subir.
 * No topo ele também some.
 *
 * Sem JS ninguém sabe se a página rolou: o fundo fica sempre ligado.
 */
export function NavbarBackdrop() {
  const scrolled = useScrolled();

  return (
    <div
      aria-hidden="true"
      data-scrolled={scrolled || undefined}
      className="pointer-events-none absolute inset-0 -z-10 border-b border-line bg-page opacity-0 transition-opacity duration-300 ease-out data-scrolled:opacity-100 stage-pinned:opacity-0 noscript:opacity-100"
    />
  );
}
