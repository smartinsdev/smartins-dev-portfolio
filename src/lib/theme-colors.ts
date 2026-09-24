/**
 * Cores do tema para onde não existe CSS: a cor da barra do navegador
 * (`viewport.themeColor`), o manifest, a imagem de Open Graph e a logo
 * (que também é desenhada na imagem de Open Graph).
 *
 * São cópias dos tokens do `@theme` em globals.css. Se mudar uma cor lá,
 * mude aqui também.
 */
export const themeColors = {
  ink900: "#070c17",
  line: "#1e2b45",
  fg: "#f3f6fb",
  fgMuted: "#93a1b8",
  ts: "#3178c6",
  tsLight: "#6aa8f5",
  react: "#61dafb",
  node: "#5fa04e",
  nodeLight: "#8cc84b",
} as const;
