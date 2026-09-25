/** O que importa de um evento de clique para saber se ele é "simples". */
type ClickLike = Pick<
  MouseEvent,
  "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey"
>;

/**
 * Clique simples: botão esquerdo, sem Ctrl/Cmd/Shift/Alt. Os outros
 * (abrir em nova aba, em nova janela, baixar) são do navegador, e o site
 * não intercepta.
 */
export function isPlainClick(event: ClickLike) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
