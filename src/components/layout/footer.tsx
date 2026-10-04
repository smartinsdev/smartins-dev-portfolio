import { site } from "@/data/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { GUTTER } from "./gutter";

export async function Footer() {
  const dict = await getDictionary();
  // A página é gerada no build, então este é o ano do último deploy.
  const year = new Date().getFullYear();

  return (
    // sm:min-h-18 (4.5rem): a partir de 640px tudo cabe numa linha, e o
    // rodapé tem essa altura. O contact.tsx desconta ela da seção para os
    // dois ocuparem juntos uma tela. É altura mínima, e não fixa: com o
    // espaçamento de texto aumentado (WCAG 1.4.12), a linha pode quebrar e
    // o rodapé cresce em vez de cortar o texto. No celular a linha pode
    // quebrar em duas, e a seção já é mais alta que a tela de qualquer
    // jeito.
    <footer
      className={`flex items-center border-t border-line py-2 sm:min-h-18 sm:py-0 ${GUTTER}`}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-x-6 font-mono text-[clamp(0.75rem,0.85vw,1rem)] uppercase tracking-widest text-fg-muted">
        <p>
          © {year} <span translate="no">{site.name}</span>
        </p>
        {/* #top é especial: sem elemento com esse id, o navegador vai para
            o topo da página. */}
        <a
          href="#top"
          className="group inline-flex min-h-11 items-center gap-[0.4em] transition-colors duration-200 hover:text-highlight"
        >
          {dict.footer.backToTop}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5"
          >
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}
