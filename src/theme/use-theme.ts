import { useSyncExternalStore } from "react";
import { fadeThemeChange } from "./fade-theme-change";
import {
  applyTheme,
  readTheme,
  saveTheme,
  subscribeTheme,
} from "./theme-store";
import type { Theme } from "./themes";

/** O servidor não sabe a escolha: o HTML sai com "Sistema" marcado. */
const serverTheme = (): Theme => "system";

/**
 * Tema escolhido e a função que troca.
 *
 * `useSyncExternalStore` é o jeito do React de ler algo que vive fora
 * dele (aqui, a escolha salva no navegador). No servidor usa
 * `serverTheme`; no navegador, logo depois de hidratar, passa para o
 * valor salvo sem erro de hidratação. `subscribeTheme` avisa o React a
 * cada troca.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);

  function setTheme(next: Theme) {
    fadeThemeChange(() => {
      saveTheme(next);
      applyTheme(next);
    });
  }

  return [theme, setTheme] as const;
}
