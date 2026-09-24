import { type RefObject, useEffect, useState } from "react";

/**
 * Vira `true` quando todas as <img> dentro de `ref` estiverem prontas para
 * aparecer, ou quando `timeoutMs` passar (o que vier primeiro). O timeout
 * garante que a página nunca fica presa no preloader.
 */
export function useImagesReady(
  ref: RefObject<HTMLElement | null>,
  timeoutMs = 4000,
) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const images = Array.from(root.querySelectorAll("img"));

    Promise.race([
      // decode() resolve quando a imagem já baixou e foi decodificada.
      // allSettled: uma imagem quebrada não impede a intro de começar.
      Promise.allSettled(images.map((img) => img.decode())),
      new Promise((resolve) => {
        timer = setTimeout(resolve, timeoutMs);
      }),
    ]).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ref, timeoutMs]);

  return ready;
}
