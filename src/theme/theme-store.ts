import { themeColors } from "../lib/theme-colors.ts";
import { isTheme, THEME_STORAGE_KEY, type Theme } from "./themes.ts";

// Guarda a escolha do tema e aplica no <html>. Roda só no navegador: o
// servidor não sabe o tema (as páginas são estáticas).

/**
 * Última escolha conhecida. Com o storage bloqueado, a escolha continua
 * valendo nesta aba; só não fica lembrada depois do F5.
 */
let current: Theme | undefined;
const listeners = new Set<() => void>();

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

/** A escolha atual: a da memória ou, na primeira vez, a do storage. */
export function readTheme(): Theme {
  current ??= readStoredTheme();
  return current;
}

/** Guarda a escolha e avisa quem estiver ouvindo (o hook useTheme). */
export function saveTheme(theme: Theme) {
  current = theme;
  try {
    // "system" é a ausência de escolha: apaga em vez de gravar.
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage bloqueado: a escolha fica só na memória.
  }
  for (const listener of listeners) listener();
}

/** O formato que o useSyncExternalStore pede: assina e devolve o cancelamento. */
export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Põe o tema no <html> (o CSS faz o resto) e acerta a cor da barra do
 * navegador. O layout gera duas <meta name="theme-color">, uma para cada
 * `prefers-color-scheme`. Com escolha forçada, as duas recebem a cor do
 * tema escolhido, e vale a que o navegador estiver usando.
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);

  const metas = document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  for (const meta of metas) {
    const scheme =
      theme === "system"
        ? meta.media.includes("dark")
          ? "dark"
          : "light"
        : theme;
    meta.content =
      scheme === "dark" ? themeColors.pageDark : themeColors.pageLight;
  }
}
