"use client";

import type { ComponentProps, ComponentType } from "react";
import { MonitorIcon } from "@/components/ui/monitor-icon";
import { MoonIcon } from "@/components/ui/moon-icon";
import { SunIcon } from "@/components/ui/sun-icon";
import { type Theme, themes } from "@/theme/themes";
import { useTheme } from "@/theme/use-theme";

const icons: Record<Theme, ComponentType<ComponentProps<"svg">>> = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
};

type ThemeSwitchProps = {
  /** "Tema" / "Theme". */
  legend: string;
  /** Nome de cada opção no idioma da página. */
  labels: Record<Theme, string>;
};

/**
 * Controle segmentado do tema. Por baixo são três botões de rádio
 * nativos num <fieldset>: o navegador já cuida do teclado (Tab entra no
 * grupo, as setas trocam a opção) e do que o leitor de tela anuncia
 * ("Claro, botão de opção, 2 de 3"). O <input> fica invisível (sr-only)
 * e quem desenha o segmento é o <label>, que reage ao rádio de dentro
 * com has-checked e has-focus-visible.
 */
export function ThemeSwitch({ legend, labels }: ThemeSwitchProps) {
  const [theme, setTheme] = useTheme();

  return (
    <fieldset>
      <legend className="font-mono text-xs uppercase tracking-widest text-fg-muted">
        {legend}
      </legend>
      <div className="mt-2 grid grid-cols-3 gap-0.5 rounded-[0.625rem] bg-page p-[3px] ring-1 ring-line">
        {themes.map((option) => {
          const Icon = icons[option];
          return (
            <label
              key={option}
              className="flex min-h-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-[0.4375rem] text-xs text-fg-muted transition-colors duration-200 hover:text-fg has-checked:bg-surface has-checked:text-fg has-checked:ring-1 has-checked:ring-fg-muted has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-highlight"
            >
              <input
                type="radio"
                name="theme"
                value={option}
                checked={theme === option}
                onChange={() => setTheme(option)}
                className="peer sr-only"
              />
              <Icon className="size-[1.0625rem] peer-checked:text-highlight" />
              {labels[option]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
