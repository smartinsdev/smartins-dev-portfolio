import { useSyncExternalStore } from "react";

// Fora do hook: a mesma função a cada render, então o React não desfaz e
// refaz a inscrição toda vez.
// O listener é passivo: avisa o navegador que ninguém vai cancelar a
// rolagem, então ela não espera o JS.
function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const readScrolled = () => window.scrollY > 0;

/** O servidor não sabe a rolagem: o HTML sai como se estivesse no topo. */
const serverScrolled = () => false;

/**
 * `true` quando a página saiu do topo; volta a `false` no topo.
 *
 * `useSyncExternalStore` é o jeito do React de ler algo que vive fora
 * dele (igual ao useTheme). O valor lido é um booleano, então o React só
 * renderiza de novo quando ele muda (topo ↔ fora do topo), e não a cada
 * evento de scroll. Se a página abrir já rolada (recarregar, link com
 * #projects), ele troca para `true` logo depois de hidratar.
 */
export function useScrolled() {
  return useSyncExternalStore(subscribe, readScrolled, serverScrolled);
}
