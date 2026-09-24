/**
 * Lembra se a intro já tocou nesta aba. É uma variável de módulo: ela
 * sobrevive às navegações do Next no cliente (como trocar de idioma) e
 * zera quando a página recarrega (F5), que é quando a intro deve tocar
 * de novo.
 *
 * Na troca de idioma, o React monta a <Intro> de novo (medido com o
 * agent-browser), então sem isto a intro repetiria.
 */
let played = false;

export function hasIntroPlayed() {
  return played;
}

export function markIntroPlayed() {
  played = true;
}
