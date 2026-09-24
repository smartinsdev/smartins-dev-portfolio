"use client";

import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useEffect } from "react";
import { markIntroPlayed } from "@/components/intro/intro-played";
import { type Locale, localeInfo, locales } from "@/i18n/locales";
import { localizePath } from "@/i18n/localize-path";
import { rememberLocale } from "@/i18n/remember-locale";

type LanguageSwitchProps = {
  current: Locale;
  /** id do texto "Idioma", que dá nome à lista para leitores de tela. */
  labelledBy: string;
  /** id do botão de preferências, que recebe o foco depois da troca. */
  returnFocusTo: string;
};

// Na troca de idioma a página é montada de novo, e o foco cairia no
// <body>: quem usa teclado ou leitor de tela perderia o lugar. Esta
// variável de módulo sobrevive à troca e avisa o seletor novo para
// devolver o foco ao botão de preferências.
let returnFocusAfterSwitch = false;

export function LanguageSwitch({
  current,
  labelledBy,
  returnFocusTo,
}: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!returnFocusAfterSwitch) return;
    returnFocusAfterSwitch = false;
    document.getElementById(returnFocusTo)?.focus();
  }, [returnFocusTo]);

  function switchTo(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    // Ctrl/Cmd/Shift/Alt + clique ou botão do meio: o navegador abre em
    // outra aba ou janela, como em qualquer link. Só o clique simples
    // troca o idioma desta aba.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    rememberLocale(locale);
    // A página do outro idioma pode montar a intro de novo: isto avisa
    // que ela já tocou e deve aparecer pronta.
    markIntroPlayed();
    returnFocusAfterSwitch = true;
    // Navegação do Next no cliente, sem recarregar a página.
    // replace: o botão voltar não vira uma alternância entre idiomas.
    // scroll: false: a página fica onde estava. O hash (#about) vai junto,
    // lido agora, porque ele muda sem o componente renderizar de novo.
    router.replace(`${localizePath(pathname, locale)}${window.location.hash}`, {
      scroll: false,
    });
  }

  return (
    <ul aria-labelledby={labelledBy} className="mt-1 flex flex-col">
      {locales.map((locale) => {
        const { htmlLang, name } = localeInfo[locale];

        // O idioma atual não é link: clicar nele não faria nada.
        if (locale === current) {
          return (
            <li key={locale}>
              <span
                aria-current="true"
                lang={htmlLang}
                className="flex min-h-11 items-center gap-3 text-fg"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-accent"
                />
                {name}
              </span>
            </li>
          );
        }

        // Um link de verdade: sem JavaScript, vira uma navegação normal.
        return (
          <li key={locale}>
            <a
              href={localizePath(pathname, locale)}
              hrefLang={htmlLang}
              lang={htmlLang}
              onClick={(event) => switchTo(event, locale)}
              className="flex min-h-11 items-center gap-3 text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              <span aria-hidden="true" className="size-1.5" />
              {name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
