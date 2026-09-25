/**
 * Contas da fileira de projetos. Só entram e saem números: quem mede o
 * DOM é quem chama. Por isso dá para testar com node --test, sem
 * navegador.
 */

/**
 * Quanto a fileira anda para a esquerda até o último card encostar na
 * margem direita do palco. Nunca é negativo: se a fileira cabe no
 * palco, ela não anda.
 */
export function trackTravel(trackWidth: number, stageWidth: number) {
  return Math.max(0, trackWidth - stageWidth);
}

/**
 * Em que ponto do slide (0 = começo, 1 = fim) um card aparece inteiro.
 *
 * O alvo é o card alinhado à margem esquerda, onde o primeiro card
 * começa. Os últimos cards não chegam lá (a fileira acaba antes), então
 * o resultado para em 1.
 *
 * @param cardLeft distância do começo da fileira até o card (offsetLeft)
 * @param firstCardLeft a mesma medida do primeiro card, que é a margem
 * @param travel quanto a fileira anda (trackTravel)
 */
export function cardProgress(
  cardLeft: number,
  firstCardLeft: number,
  travel: number,
) {
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, (cardLeft - firstCardLeft) / travel));
}
