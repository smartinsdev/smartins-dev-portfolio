const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Trocas em andamento. Clicar rápido pode começar uma troca antes de a
 * anterior acabar; o atributo só sai quando a última termina.
 */
let pending = 0;

/**
 * Roda `update` (a troca de tema) com um fade curto. A View Transitions
 * API tira uma "foto" da página, roda `update` e faz um cross-fade da
 * foto para a página nova (a duração está no globals.css).
 *
 * Sem suporte no navegador, ou com "reduzir movimento", troca direto.
 * Nos dois casos, `data-theme-switching` no <html> desliga as transições
 * CSS durante a troca (ver globals.css).
 */
export function fadeThemeChange(update: () => void) {
  const root = document.documentElement;
  pending += 1;
  root.setAttribute("data-theme-switching", "");

  const done = () => {
    pending -= 1;
    if (pending === 0) root.removeAttribute("data-theme-switching");
  };

  if (
    !("startViewTransition" in document) ||
    matchMedia(REDUCED_MOTION).matches
  ) {
    update();
    // Dois quadros: o navegador pinta o tema novo antes de as transições
    // voltarem.
    requestAnimationFrame(() => requestAnimationFrame(done));
    return;
  }

  // Começar uma troca durante outra pula a anterior. `finished` resolve
  // mesmo assim, então o contador sempre volta a zero.
  document.startViewTransition(update).finished.finally(done);
}
