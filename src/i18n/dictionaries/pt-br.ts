// Textos do site em português. O formato daqui define o tipo Dictionary:
// o en.ts precisa ter exatamente as mesmas chaves.
//
// Sem `as const` de propósito: assim cada valor tem tipo `string` (e não
// o texto exato), e o inglês pode ter textos diferentes nas mesmas chaves.
export const ptBr = {
  meta: {
    title: "Portfólio",
    description: "Desenvolvedor Full Stack. Portfólio de Sinval Martins.",
  },
  nav: {
    label: "Principal",
    projects: "Projetos",
    about: "Sobre",
    contact: "Contato",
  },
  preferences: {
    open: "Preferências",
    language: "Idioma",
  },
  hero: {
    role: "Desenvolvedor Full Stack",
    tagline: ["Disponível para", "novos projetos"],
    cta: "Ver projetos",
    newTab: "(abre em nova aba)",
  },
  notFound: {
    title: "Página não encontrada",
    description: "O endereço pode ter mudado ou nunca ter existido.",
    back: "Voltar para o início",
  },
};

export type Dictionary = typeof ptBr;
