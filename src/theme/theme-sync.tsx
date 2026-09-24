"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readTheme } from "./theme-store";

/**
 * Põe o tema salvo no <html> depois que o React assume a página. Não
 * desenha nada.
 *
 * O script do <head> já fez isso antes da primeira pintura, mas:
 * - no modo dev, o Strict Mode monta tudo duas vezes e, na segunda, o
 *   React limpa os atributos do <html> que ele não conhece;
 * - o global-error desenha um <html> novo, onde o script não roda;
 * - a cor da barra do navegador só é acertada aqui.
 * useLayoutEffect roda antes de o navegador pintar, então nada pisca.
 */
export function ThemeSync() {
  useLayoutEffect(() => {
    applyTheme(readTheme());
  }, []);

  return null;
}
