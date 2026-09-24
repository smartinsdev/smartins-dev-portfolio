/**
 * Cores para onde não existe CSS: a cor da barra do navegador
 * (`viewport.themeColor` e o `applyTheme`), o manifest, a imagem de Open
 * Graph e a logo (que também é desenhada na imagem de Open Graph).
 *
 * São cópias dos tokens do `globals.css`. Se mudar uma cor lá, mude aqui
 * também. Fora `pageLight`, são as cores do tema escuro: a imagem de
 * compartilhamento e o manifest são sempre escuros.
 *
 * O src/theme/theme-store.ts importa este arquivo com ".ts" e sem "@/",
 * porque é testado com `node --test`.
 */
export const themeColors = {
  pageDark: "#070c17",
  pageLight: "#f4f7fb",
  line: "#1e2b45",
  fg: "#f3f6fb",
  fgMuted: "#93a1b8",
  ts: "#3178c6",
  tsLight: "#6aa8f5",
  react: "#61dafb",
  node: "#5fa04e",
  nodeLight: "#8cc84b",
} as const;
