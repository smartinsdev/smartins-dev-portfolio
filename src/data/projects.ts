/** Chave de cada projeto em `projects.items` nos dicionários. */
export type ProjectId = "almeytour" | "mognus" | "blizzard" | "ecommerce-ddd";

export type ProjectData = {
  id: ProjectId;
  /** Ano de entrega, ou "ongoing" enquanto o projeto continua. */
  year: number | "ongoing";
  stack: string[];
  /** "site" leva ao projeto no ar; "code", ao repositório. Muda o texto do link. */
  link: { href: string; kind: "site" | "code" };
};

// O que não muda com o idioma; nome e descrição ficam nos dicionários.
// A ordem daqui é a ordem da fileira (e a do número 01, 02...).
export const projects: ProjectData[] = [
  {
    id: "almeytour",
    year: "ongoing",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS 4",
      "Framer Motion",
      "Vitest",
      "Playwright",
    ],
    link: { href: "https://almeytour.com/", kind: "site" },
  },
  {
    id: "mognus",
    year: 2025,
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "next-intl 4", "Zod"],
    link: {
      href: "https://github.com/smartinsdev/mognus-company",
      kind: "code",
    },
  },
  {
    id: "blizzard",
    year: 2024,
    stack: [
      "Next.js 16",
      "TypeScript 7",
      "Tailwind CSS 4",
      "shadcn/ui",
      "React Hook Form",
      "Prisma",
    ],
    link: { href: "https://github.com/smartinsdev/blizzardco", kind: "code" },
  },
  {
    id: "ecommerce-ddd",
    year: "ongoing",
    stack: ["TypeScript", "Node.js", "CI", "Biome"],
    link: {
      href: "https://github.com/smartinsdev/backend-ecommerce-portfolio",
      kind: "code",
    },
  },
];
