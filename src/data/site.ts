export const site = {
  name: "Sinval Martins",
  // Ids das seções da home, na ordem da navbar. São iguais nos dois
  // idiomas: trocar de idioma mantém a âncora da URL (#about continua
  // #about). Os rótulos ficam nos dicionários (src/i18n/dictionaries).
  nav: ["projects", "about", "contact"],
  ctaHref: "#projects",
  socials: [
    { label: "GitHub", href: "https://github.com/smartinsdev" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/smartins-dev" },
  ],
} as const;
