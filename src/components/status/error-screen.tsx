"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatusPage } from "./status-page";

type ErrorScreenProps = {
  /** `digest` identifica o erro nos logs do servidor. */
  error: Error & { digest?: string };
  /** Vem do Next: busca e renderiza de novo o trecho que quebrou. */
  retry: () => void;
};

export function ErrorScreen({ error, retry }: ErrorScreenProps) {
  useEffect(() => {
    // Por enquanto só no console. Um serviço de monitoramento (ex.:
    // Sentry) receberia o erro aqui.
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="Erro"
      title="Algo deu errado"
      description="Um erro inesperado impediu esta página de carregar. Tente de novo; se continuar, volte para o início."
    >
      <Button onClick={() => retry()}>Tentar de novo</Button>
      <a
        href="/"
        className="text-fg-muted underline-offset-4 transition-colors duration-200 hover:text-fg hover:underline"
      >
        Voltar para o início
      </a>
    </StatusPage>
  );
}
