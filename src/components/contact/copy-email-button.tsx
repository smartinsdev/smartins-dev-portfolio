"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/ui/check-icon";
import { CopyIcon } from "@/components/ui/copy-icon";
import { type CopyResult, copyText } from "@/lib/copy-text";

/** Quanto tempo o aviso fica na tela depois do clique. */
const FEEDBACK_MS = 2500;

type CopyEmailButtonProps = {
  email: string;
  /**
   * Textos no idioma da página: os dicionários ficam no servidor. Além do
   * nome do botão, um aviso para cada resultado de copyText().
   */
  labels: { copy: string } & Record<CopyResult, string>;
};

/**
 * Copia o e-mail. Existe porque muita gente não tem um programa de e-mail
 * configurado, e aí o link `mailto:` não abre nada.
 *
 * O nome do botão não muda ("Copiar e-mail"): quem avisa o resultado é o
 * texto ao lado, num <output> (o elemento de "resultado de uma ação").
 * Ele já existe vazio na página, então o leitor de tela lê quando o texto
 * aparece, sem tirar o foco do botão.
 */
export function CopyEmailButton({ email, labels }: CopyEmailButtonProps) {
  // Um objeto novo a cada clique (e não só o texto): copiar duas vezes
  // seguidas recomeça a contagem do aviso, mesmo com o mesmo resultado.
  const [feedback, setFeedback] = useState<{ result: CopyResult } | null>(null);

  // O aviso some sozinho. A limpeza cancela o timer se a pessoa clicar de
  // novo antes (ou se o componente sair da página).
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function copy() {
    setFeedback({ result: await copyText(navigator.clipboard, email) });
  }

  const copied = feedback?.result === "copied";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 cursor-pointer items-center gap-[0.6em] rounded-full px-[1.1em] font-mono text-[clamp(0.8125rem,0.9vw,1rem)] uppercase tracking-widest text-fg-muted ring-1 ring-line transition-colors duration-200 hover:text-fg hover:ring-highlight"
      >
        {copied ? (
          <CheckIcon className="size-[1.15em] text-highlight" />
        ) : (
          <CopyIcon className="size-[1.15em]" />
        )}
        {labels.copy}
      </button>
      {/* aria-live explícito: o <output> já deveria ser anunciado, mas
          nem todo leitor de tela faz isso sem o atributo. A cor é a do
          texto, e não a de destaque: no tema claro, o destaque dava 6,4:1
          medido na tela, abaixo do 7:1 (AAA). O destaque fica no ícone. */}
      <output
        aria-live="polite"
        className="text-[clamp(0.875rem,0.95vw,1.0625rem)] text-fg"
      >
        {feedback ? labels[feedback.result] : ""}
      </output>
    </div>
  );
}
