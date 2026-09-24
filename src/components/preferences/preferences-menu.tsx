import { SlidersIcon } from "@/components/ui/sliders-icon";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { LanguageSwitch } from "./language-switch";
import styles from "./preferences-menu.module.css";
import { ThemeSwitch } from "./theme-switch";

const PANEL_ID = "preferences-panel";
const BUTTON_ID = "preferences-button";
const LANGUAGE_LABEL_ID = "preferences-language";

/**
 * Botão da navbar que abre o painel de preferências. Abrir e fechar é
 * trabalho do navegador (atributo `popover`), então isto continua sendo
 * server component. Só os seletores de idioma e de tema rodam no
 * cliente, e recebem os textos por props: os dicionários ficam no
 * servidor.
 */
export async function PreferencesMenu() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <>
      {/* popoverTarget liga o botão ao painel pelo id. O navegador também
          informa aos leitores de tela se o painel está aberto. */}
      <button
        id={BUTTON_ID}
        type="button"
        popoverTarget={PANEL_ID}
        aria-label={dict.preferences.open}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:text-fg"
      >
        <SlidersIcon className="size-5" />
      </button>

      {/* popover="auto": fecha com Esc, com clique fora e devolve o foco ao
          botão. Aberto, vai para a "top layer": fica acima de tudo e é
          posicionado pela janela, então a animação da intro no elemento
          pai não o desloca. */}
      <div
        id={PANEL_ID}
        popover="auto"
        className={`${styles.panel} fixed inset-auto top-[calc(clamp(1rem,2.6svh,2.5rem)+3.25rem)] right-[clamp(1.25rem,3vw,5rem)] m-0 w-56 rounded-xl border-0 bg-surface p-4 text-fg shadow-2xl shadow-black/40 light:shadow-black/10 ring-1 ring-line`}
      >
        <p
          id={LANGUAGE_LABEL_ID}
          className="font-mono text-xs uppercase tracking-widest text-fg-muted"
        >
          {dict.preferences.language}
        </p>
        <LanguageSwitch
          current={locale}
          labelledBy={LANGUAGE_LABEL_ID}
          returnFocusTo={BUTTON_ID}
        />
        {/* noscript:hidden: sem JavaScript, trocar o tema não funciona
            (o site segue o sistema, só com CSS), então o grupo some. */}
        <div className="mt-4 noscript:hidden">
          <ThemeSwitch
            legend={dict.preferences.theme}
            labels={dict.preferences.themes}
          />
        </div>
      </div>
    </>
  );
}
