import type { Locale } from "./locales";

type ErrorTexts = {
  code: string;
  title: string;
  description: string;
  retry: string;
  back: string;
};

/**
 * Textos das telas de erro. Ficam fora dos dicionários porque error
 * boundaries são client components: importar o dicionário inteiro
 * mandaria todos os textos do site para o JavaScript do navegador.
 */
export const errorTexts: Record<Locale, ErrorTexts> = {
  "pt-br": {
    code: "Erro",
    title: "Algo deu errado",
    description:
      "Um erro inesperado impediu esta página de carregar. Tente de novo; se continuar, volte para o início.",
    retry: "Tentar de novo",
    back: "Voltar para o início",
  },
  en: {
    code: "Error",
    title: "Something went wrong",
    description:
      "An unexpected error stopped this page from loading. Try again; if it keeps happening, go back to the home page.",
    retry: "Try again",
    back: "Back to home",
  },
};
