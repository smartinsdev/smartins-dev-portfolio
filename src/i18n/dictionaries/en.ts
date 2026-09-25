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
    theme: "Theme",
    themes: {
      system: "System",
      light: "Light",
      dark: "Dark",
    },
  },
  hero: {
    role: "Full Stack Developer",
    tagline: ["Available for", "new projects"],
    cta: "View projects",
    newTab: "(opens in a new tab)",
  },
  projects: {
    title: "Projects",
    stack: "Technologies",
    ongoing: "Ongoing",
    viewSite: "View site",
    viewCode: "View code",
    items: {
      almeytour: {
        name: "Almeytour",
        description:
          "Marketing and conversion website for airport transfers and private tours in Europe, focused on Paris. It presents services, testimonials and exclusive experiences, and guides visitors to reach the team on WhatsApp.",
      },
      mognus: {
        name: "Mognu's Company",
        description:
          "Multilingual corporate website for a custom carpentry and furniture business: company, services, selected projects and contact, in a responsive interface built for international visitors.",
      },
      blizzard: {
        name: "Blizzard Conquer",
        description:
          "Web portal for a fantasy MMORPG community: themed landing page, registration and login against the game database, session-protected routes and a download hub for the game client.",
      },
      "ecommerce-ddd": {
        name: "E-commerce Back-end with DDD",
        description:
          "Node.js and TypeScript back-end prototype that demonstrates DDD, Clean Architecture, SOLID, TDD and dependency inversion, with clear boundaries between layers.",
      },
    },
  },
  notFound: {
    title: "Page not found",
    description: "This address may have changed or never existed.",
    back: "Back to home",
  },
};
