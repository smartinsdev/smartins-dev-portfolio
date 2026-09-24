import type { Dictionary } from "./pt-br";

// Anotar o tipo (`: Dictionary`) é o que faz o TypeScript acusar chave
// faltando ou sobrando em relação ao português.
export const en: Dictionary = {
  meta: {
    title: "Portfolio",
    description: "Full Stack Developer. Portfolio of Sinval Martins.",
  },
  nav: {
    label: "Main",
    projects: "Projects",
    about: "About",
    contact: "Contact",
  },
  preferences: {
    open: "Preferences",
    language: "Language",
  },
  hero: {
    role: "Full Stack Developer",
    tagline: ["Available for", "new projects"],
    cta: "View projects",
    newTab: "(opens in a new tab)",
  },
  notFound: {
    title: "Page not found",
    description: "This address may have changed or never existed.",
    back: "Back to home",
  },
};
