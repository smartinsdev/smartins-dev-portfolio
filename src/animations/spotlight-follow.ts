import { gsap } from "@/lib/gsap";

/** Segundos que a luz leva para "alcançar" o mouse. Maior = mais preguiçosa. */
const LAG = 1.1;

/**
 * Faz a luz seguir o ponteiro dentro de `area`.
 *
 * Os filhos de `light` são camadas de cor, da esquerda para a direita:
 * cada uma acende quando o mouse passa pela sua faixa da tela.
 *
 * Precisa rodar dentro de um `gsap.matchMedia()` (ou `useGSAP`): os tweens
 * criados aqui entram no contexto e são desfeitos sozinhos. Os listeners
 * não são do GSAP, então a função devolve a limpeza deles.
 */
export function createSpotlightFollow(area: HTMLElement, light: HTMLElement) {
  const layers = gsap.utils.toArray<HTMLElement>(light.children);

  // xPercent/yPercent -50 puxam o círculo metade para cima e para a
  // esquerda: assim o *centro* fica no ponto (x, y), e não o canto.
  // O GSAP combina os dois: translate(-50%, -50%) + x/y em pixels.
  gsap.set(light, { xPercent: -50, yPercent: -50 });

  // quickTo cria UM tween e devolve uma função que só troca o destino.
  // O pointermove dispara dezenas de vezes por segundo: com gsap.to()
  // seriam dezenas de tweens novos; aqui é sempre o mesmo, reaproveitado.
  const moveX = gsap.quickTo(light, "x", { duration: LAG, ease: "power3" });
  const moveY = gsap.quickTo(light, "y", { duration: LAG, ease: "power3" });
  const fades = layers.map((layer) =>
    gsap.quickTo(layer, "opacity", { duration: LAG, ease: "power2" }),
  );

  // Tween pausado = animação pronta esperando comando.
  // play() acende a luz, reverse() apaga, e dá para alternar no meio.
  const reveal = gsap.to(light, {
    autoAlpha: 1,
    duration: 0.8,
    ease: "power2.out",
    paused: true,
  });

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;

    const box = area.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;

    // Luz apagada: o 2º argumento é o valor de partida. Passando o
    // próprio destino, ela "nasce" embaixo do mouse em vez de voar
    // do último lugar onde estava.
    const isHidden = reveal.progress() === 0;
    moveX(x, isHidden ? x : undefined);
    moveY(y, isHidden ? y : undefined);

    // normalize: converte x (0 até a largura) em 0..1.
    // clamp: garante 0..1 mesmo com o mouse fora da área (na navbar etc.).
    const progress = gsap.utils.clamp(
      0,
      1,
      gsap.utils.normalize(0, box.width, x),
    );
    layerWeights(progress, fades.length).forEach((weight, index) => {
      fades[index](weight);
    });

    reveal.play();
  };

  const onLeave = () => reveal.reverse();

  // passive: avisa o navegador que não vamos chamar preventDefault(),
  // então ele não precisa esperar o handler para seguir rolando a página.
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);

  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
}

/**
 * Peso de cada camada para uma posição 0..1. Cada camada tem seu pico
 * num ponto da tela (com 3 camadas: 0, 0.5 e 1) e some em direção às
 * vizinhas, então no meio do caminho duas se misturam.
 */
function layerWeights(progress: number, count: number) {
  const position = progress * (count - 1);
  return Array.from({ length: count }, (_, index) =>
    Math.max(0, 1 - Math.abs(position - index)),
  );
}
