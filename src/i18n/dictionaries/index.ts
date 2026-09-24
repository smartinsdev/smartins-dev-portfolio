import type { Locale } from "../locales";
import { en } from "./en";
import { type Dictionary, ptBr } from "./pt-br";

export type { Dictionary };

/** Dicionário de cada idioma. Só código de servidor importa isto. */
export const dictionaries: Record<Locale, Dictionary> = {
  "pt-br": ptBr,
  en,
};
