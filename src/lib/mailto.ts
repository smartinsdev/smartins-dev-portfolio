/**
 * Link `mailto:` com assunto opcional.
 *
 * O assunto passa pelo encodeURIComponent, e não pelo URLSearchParams: o
 * URLSearchParams troca espaço por "+", e no mailto o "+" chega como "+"
 * no assunto do e-mail (a RFC 6068 pede o espaço como %20).
 */
export function mailtoHref(email: string, subject?: string) {
  if (!subject) return `mailto:${email}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
