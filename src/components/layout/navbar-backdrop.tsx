"use client";

import { useScrolled } from "@/hooks/use-scrolled";

/**
 * Fundo da navbar, que aparece aos poucos quando a página sai do topo.
 *
 * A navbar é fixa e transparente. No layout estático de Projetos (menos
 * movimento, tela baixa ou sem JS), os cards passam por baixo dela e o
 * texto dos links se mistura com o dos cards. No modo cinema isso não
 * acontece (nada rola por baixo dela), então o fundo nem existe lá
 * (cinema:hidden). No topo ele some, e o hero fica como sempre foi.
 *
 * Sem JS ninguém sabe se a página rolou: o fundo fica sempre ligado.
 */
export function NavbarBackdrop() {
  const scrolled = useScrolled();

  return (
    <div
      aria-hidden="true"
      data-scrolled={scrolled || undefined}
      className="pointer-events-none absolute inset-0 -z-10 border-b border-line bg-page opacity-0 transition-opacity duration-300 ease-out data-scrolled:opacity-100 cinema:hidden noscript:opacity-100"
    />
  );
}
