import { THEME_STORAGE_KEY, themes } from "./themes.ts";

// Os temas que forçam um lado. "system" fica de fora: sem atributo, o
// CSS segue o sistema operacional.
const forcedThemes = themes.filter((theme) => theme !== "system");

/**
 * Script que o layout põe no <head>. O navegador roda ele enquanto lê o
 * HTML, antes de pintar a página: a escolha salva já aparece no primeiro
 * quadro, sem piscar o outro tema. (Num useEffect, só rodaria depois de
 * o React carregar, com a página já pintada.)
 *
 * É texto, não função, porque vai direto para o HTML: por isso é JS
 * antigo (var, indexOf) e não usa nada de fora. O try/catch cobre o
 * storage bloqueado; aí vale o sistema.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(forcedThemes)}.indexOf(t)!==-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
