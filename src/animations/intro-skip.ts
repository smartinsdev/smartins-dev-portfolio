import type { gsap } from "@/lib/gsap";

/** Quantas vezes mais rápido o resto da intro corre depois da interação. */
const SPEED = 4;

// Clique ou toque na tela, tecla e rodinha do mouse ou trackpad.
const INPUTS = ["pointerdown", "keydown", "wheel"] as const;

/**
 * Acelera a intro na primeira interação: quem tem pressa não precisa
 * esperar a animação inteira, e mesmo assim não perde nenhum passo.
 *
 * timeScale muda a velocidade da agulha (4 = quatro vezes mais rápido).
 * Ele não passa por cima da pausa das imagens: se elas ainda estiverem
 * carregando, a intro continua esperando por elas.
 *
 * Devolve a limpeza dos listeners, que também roda sozinha quando a
 * intro termina.
 */
export function speedUpOnInput(tl: gsap.core.Timeline) {
  const speedUp = () => {
    tl.timeScale(SPEED);
    stop();
  };

  const stop = () => {
    for (const type of INPUTS) window.removeEventListener(type, speedUp);
  };

  // passive: avisa que não vamos chamar preventDefault(), então o
  // navegador não precisa esperar este handler para rolar a página.
  for (const type of INPUTS) {
    window.addEventListener(type, speedUp, { passive: true });
  }

  // then() resolve quando a timeline termina. Depois disso não há mais o
  // que acelerar, então os listeners saem.
  tl.then(stop);

  return stop;
}
