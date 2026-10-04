import { GUTTER } from "@/components/layout/gutter";
import { SocialLinks } from "@/components/ui/social-links";
import { StatusDot } from "@/components/ui/status-dot";
import { site } from "@/data/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { mailtoHref } from "@/lib/mailto";
import { ContactLogo } from "./contact-logo";
import { CopyEmailButton } from "./copy-email-button";

/** Etiqueta mono, a mesma do "Projetos (04)" e das legendas dos detalhes. */
const LABEL =
  "font-mono text-[clamp(0.8125rem,1vw,1.125rem)] uppercase tracking-widest text-fg-muted";

export async function Contact() {
  const dict = await getDictionary();
  const { contact } = dict;
  const [lead, highlight] = contact.headline;

  return (
    // A seção e o rodapé são o último quadro do site e ocupam juntos a
    // tela inteira: a altura mínima é a tela menos os 4.5rem do rodapé
    // (o sm:min-h-18 do footer.tsx; mudou lá, muda aqui). A logo vai para o pé
    // da seção (mt-auto). O padding de cima é o do hero e o dos Projetos:
    // a navbar fixa cobre só o padding quando o link #contact traz a seção
    // para o topo.
    //
    // A partir de 640px (sm), os tamanhos são min(Xvw, Ysvh), como nos
    // cards: crescem com a largura, mas encolhem numa tela baixa. Assim o
    // conteúdo cabe na altura e, no fim da página, a seção aparece inteira,
    // sem o título embaixo da navbar. No celular ela é mais alta que a tela
    // de qualquer jeito, e os tamanhos seguem só a largura.
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={`flex min-h-[calc(100svh-4.5rem)] flex-col bg-contact-glow pt-[clamp(5.5rem,11svh,8.5rem)] pb-[clamp(2rem,5svh,4rem)] ${GUTTER}`}
    >
      {/* Mesmo formato do título de Projetos: etiqueta com o nome do link
          da navbar e a frase grande embaixo. O leitor de tela lê
          "Contato: Tem um projeto em mente? Vamos conversar." */}
      <h2
        id="contact-title"
        className="flex flex-col gap-[clamp(0.5rem,1.5svh,1rem)]"
      >
        <span className={LABEL}>{contact.title}</span>
        <span className="sr-only">: </span>
        <span className="font-display text-[clamp(2rem,9vw,2.5rem)] font-semibold leading-[1.05] tracking-tight text-balance sm:text-[clamp(2.5rem,min(5vw,8svh),5rem)]">
          <span className="block">{lead}</span>{" "}
          {/* w-fit: o degradê se estica pela largura do elemento. Com a
              largura da seção inteira, a frase só pegaria o começo dele (o
              azul) e nunca chegaria ao verde. */}
          <span className="block w-fit bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
            {highlight}
          </span>
        </span>
      </h2>

      {/* No celular o botão fica embaixo do e-mail; a partir de 640px, ao
          lado. */}
      <div className="mt-[clamp(1.5rem,5svh,3.5rem)] flex flex-col items-start gap-[clamp(0.75rem,2svh,1.25rem)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
        {/* O e-mail é a ação principal da seção, então é o maior texto
            depois do título. [overflow-wrap:anywhere]: numa tela mais
            estreita que o endereço, ele quebra em vez de vazar.
            translate="no": o tradutor automático do navegador não mexe no
            endereço. */}
        <a
          href={mailtoHref(site.email, contact.emailSubject)}
          translate="no"
          className="text-[clamp(1.125rem,5vw,1.75rem)] font-semibold tracking-tight underline decoration-line decoration-[0.06em] underline-offset-[0.2em] transition-colors duration-200 [overflow-wrap:anywhere] hover:text-highlight hover:decoration-highlight sm:text-[clamp(1.75rem,min(3vw,5svh),3rem)]"
        >
          {site.email}
        </a>
        {/* noscript:hidden: sem JavaScript o botão não copia nada. */}
        <div className="noscript:hidden">
          <CopyEmailButton
            email={site.email}
            labels={{
              copy: contact.copy,
              copied: contact.copied,
              failed: contact.copyFailed,
            }}
          />
        </div>
      </div>

      {/* Lista de pares "legenda: valor": <dl> é o elemento feito para
          isso, e o leitor de tela anuncia cada legenda com o seu valor. */}
      <dl className="mt-[clamp(2rem,6svh,4.5rem)] grid gap-6 border-t border-line pt-[clamp(1rem,2.5svh,2rem)] md:grid-cols-3">
        <div>
          <dt className={LABEL}>{contact.status}</dt>
          {/* O mesmo aviso do hero, com o mesmo pontinho: é a mesma
              informação, então o texto vem do mesmo lugar. */}
          <dd className="mt-2 flex items-center gap-[0.6em] text-[clamp(1rem,1.2vw,1.375rem)] font-medium">
            <StatusDot />
            {dict.hero.tagline.join(" ")}
          </dd>
        </div>
        <div>
          <dt className={LABEL}>{contact.location}</dt>
          <dd className="mt-2 text-[clamp(1rem,1.2vw,1.375rem)] font-medium">
            {contact.locationValue}
          </dd>
        </div>
        <div>
          <dt className={LABEL}>{contact.socials}</dt>
          {/* Sem margem: os links têm 44px de altura (área de toque), e o
              texto deles já fica centrado na linha dos outros valores. */}
          <dd>
            <SocialLinks className="flex gap-6 font-mono text-[clamp(0.875rem,1vw,1.125rem)] uppercase tracking-widest" />
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex justify-center pt-[clamp(2rem,6svh,5rem)]">
        <ContactLogo />
      </div>
    </section>
  );
}
