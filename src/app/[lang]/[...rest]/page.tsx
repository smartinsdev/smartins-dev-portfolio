import { notFound } from "next/navigation";

/**
 * Pega qualquer URL que não existe dentro de um idioma (ex.: /en/xyz) e
 * mostra o 404 daquele idioma (app/[lang]/not-found.tsx), dentro do layout
 * certo. Sem esta rota, o Next não acharia um not-found para URLs
 * desconhecidas, porque o layout raiz fica dentro de [lang].
 */
export default function CatchAllPage() {
  notFound();
}
