import type { ComponentProps } from "react";
import { site } from "@/data/site";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Links do GitHub e do LinkedIn, abrindo em nova aba. Aparecem no hero e
 * no Contato: cada lugar passa o layout e o tamanho pela `className` da
 * lista; o desenho de cada link é igual nos dois.
 */
export async function SocialLinks(props: ComponentProps<"ul">) {
  const dict = await getDictionary();

  return (
    <ul {...props}>
      {site.socials.map((social) => (
        <li key={social.href}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex min-h-11 items-center gap-[0.4em] text-fg-muted transition-colors duration-200 hover:text-highlight"
          >
            {social.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            >
              ↗
            </span>
            <span className="sr-only">{dict.hero.newTab}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
