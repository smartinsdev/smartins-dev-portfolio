/** Como terminou uma tentativa de copiar. */
export type CopyResult = "copied" | "failed";

/** O pedaço da Clipboard API que importa aqui. */
type ClipboardLike = Pick<Clipboard, "writeText">;

/**
 * Copia o texto para a área de transferência. Nunca lança erro: devolve
 * "failed" quando não dá (página fora de HTTPS, permissão negada,
 * navegador sem a API), e quem chama só escolhe a mensagem.
 *
 * A API chega por parâmetro (na página, `navigator.clipboard`) para o
 * teste trocar por uma falsa. Sem valor padrão de propósito: com padrão,
 * passar `undefined` usaria o padrão, e o caso "sem a API" não seria
 * testado de verdade.
 */
export async function copyText(
  clipboard: ClipboardLike | undefined,
  text: string,
): Promise<CopyResult> {
  if (!clipboard) return "failed";
  try {
    await clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
