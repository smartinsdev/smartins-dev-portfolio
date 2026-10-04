"use client";

import { useSyncExternalStore } from "react";
import { themeScript } from "./theme-script";

// Nada muda depois: não tem o que assinar.
const subscribe = () => () => {};
// No servidor e na hidratação, o React usa o terceiro argumento do
// useSyncExternalStore; em qualquer renderização só no cliente, o segundo.
const onClient = () => true;
const onServer = () => false;

/**
 * O <script> do tema, só no HTML que vem do servidor.
 *
 * Ele roda enquanto o navegador lê o HTML, antes da primeira pintura: a
 * escolha salva aparece sem piscar o outro tema. Depois disso não serve
 * para mais nada.
 *
 * O problema: na troca de idioma, o Next monta o layout raiz de novo no
 * navegador, e o React criaria um <script> novo. Script criado pelo
 * React no cliente nunca roda, e o React avisa no console ("Encountered
 * a script tag while rendering React component"). Quem acerta o tema
 * nessa hora é o <ThemeSync>.
 *
 * Por isso: no servidor e na hidratação, renderiza o script (igual ao
 * HTML, sem erro de hidratação); logo depois de hidratar, o React vê o
 * valor do cliente e tira o script, que já rodou; numa montagem só no
 * cliente (a troca de idioma), nem cria.
 *
 * Não dá para usar o next/script com beforeInteractive: um script inline
 * com essa estratégia só roda quando o JavaScript do Next carrega, depois
 * da primeira pintura, e o tema piscaria.
 */
export function ThemeScriptTag() {
  const isClientRender = useSyncExternalStore(subscribe, onClient, onServer);
  if (isClientRender) return null;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: texto fixo, montado em theme-script.ts só com constantes do projeto
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
