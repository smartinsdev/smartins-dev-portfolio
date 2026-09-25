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
    theme: "Tema",
    themes: {
      system: "Sistema",
      light: "Claro",
      dark: "Escuro",
    },
  },
  hero: {
    role: "Desenvolvedor Full Stack",
    tagline: ["Disponível para", "novos projetos"],
    cta: "Ver projetos",
    newTab: "(abre em nova aba)",
  },
  projects: {
    title: "Projetos",
    // A segunda parte ganha o degradê do subtítulo do hero.
    headline: ["Do rascunho ao", "deploy"],
    stack: "Tecnologias",
    ongoing: "Em andamento",
    viewSite: "Ver site",
    viewCode: "Ver código",
    // As chaves são os ids de src/data/projects.ts. Se faltar uma, o
    // TypeScript acusa no project-card.tsx.
    items: {
      almeytour: {
        name: "Almeytour",
        description:
          "Site de marketing e conversão para transfers de aeroporto e tours privados na Europa, com foco em Paris. Apresenta serviços, depoimentos e experiências exclusivas, e leva o visitante a falar com a equipe pelo WhatsApp.",
      },
      mognus: {
        name: "Mognu's Company",
        description:
          "Site institucional multilíngue de uma marcenaria de móveis sob medida: empresa, serviços, projetos selecionados e contato, numa interface responsiva pensada para visitantes de outros países.",
      },
      blizzard: {
        name: "Blizzard Conquer",
        description:
          "Portal de uma comunidade de MMORPG de fantasia: landing page temática, cadastro e login no banco de dados do jogo, rotas protegidas por sessão e central de downloads do cliente.",
      },
      "ecommerce-ddd": {
        name: "Back-end de e-commerce com DDD",
        description:
          "Protótipo de back-end em Node.js e TypeScript que demonstra DDD, Clean Architecture, SOLID, TDD e inversão de dependência, com fronteiras claras entre as camadas.",
      },
    },
  },
  notFound: {
    title: "Página não encontrada",
    description: "O endereço pode ter mudado ou nunca ter existido.",
    back: "Voltar para o início",
  },
};

export type Dictionary = typeof ptBr;
