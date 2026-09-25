import { useEffect, useState } from "react";

/**
 * `true` quando a página saiu do topo; volta a `false` no topo.
 *
 * O listener é passivo: avisa o navegador que ninguém vai cancelar a
 * rolagem, então ela não espera o JS. E o React só renderiza de novo
 * quando o valor muda (topo ↔ fora do topo), não a cada evento de scroll.
 */
export function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    // Já confere na montagem: a página pode abrir no meio (recarregar,
    // link com #projects).
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrolled;
}
