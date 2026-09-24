"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readTheme } from "./theme-store";

/** Alguma das mudanças pôs uma <meta name="theme-color"> nova no <head>? */
function addsThemeColor(records: MutationRecord[]) {
  return records.some((record) =>
    [...record.addedNodes].some(
      (node) => node instanceof HTMLMetaElement && node.name === "theme-color",
    ),
  );
}

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
 *
 * Na troca de idioma o Next navega sem recarregar e desenha as
 * <meta name="theme-color"> de novo, com as cores padrão, num commit do
 * React posterior ao da página (um efeito com o pathname roda cedo
 * demais, quando elas ainda não existem). Por isso um MutationObserver
 * vigia o <head> e acerta as metas novas assim que entram. O aviso dele
 * chega antes da próxima pintura, então a barra não pisca.
 */
export function ThemeSync() {
  useLayoutEffect(() => {
    applyTheme(readTheme());

    const observer = new MutationObserver((records) => {
      if (addsThemeColor(records)) applyTheme(readTheme());
    });
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
