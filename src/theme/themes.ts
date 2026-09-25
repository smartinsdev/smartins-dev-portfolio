// Fonte única dos temas. É importado pelo layout (script inline), pelo
// cliente e pelos testes (`pnpm test`).
//
// Como em src/i18n/locales.ts, os arquivos do tema testados com
// `node --test` se importam com ".ts" no final e sem o alias "@/".

/** "system" segue o sistema operacional; os outros forçam um lado. */
export const themes = ["system", "light", "dark"] as const;

export type Theme = (typeof themes)[number];

/** Chave do localStorage com a escolha do painel. "system" não é gravado. */
export const THEME_STORAGE_KEY = "theme";

/** Type guard que aceita qualquer valor: o storage devolve string ou null. */
export function isTheme(value: unknown): value is Theme {
  return (themes as readonly unknown[]).includes(value);
}
