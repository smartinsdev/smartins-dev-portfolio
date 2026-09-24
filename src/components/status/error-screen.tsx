"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { errorTexts } from "@/i18n/error-texts";
import { usePathLocale } from "@/i18n/use-path-locale";
import { StatusPage } from "./status-page";

type ErrorScreenProps = {
  /** `digest` identifica o erro nos logs do servidor. */
  error: Error & { digest?: string };
  /** Vem do Next: busca e renderiza de novo o trecho que quebrou. */
  retry: () => void;
};

export function ErrorScreen({ error, retry }: ErrorScreenProps) {
  const locale = usePathLocale();
  const texts = errorTexts[locale];

  useEffect(() => {
    // Por enquanto só no console. Um serviço de monitoramento (ex.:
    // Sentry) receberia o erro aqui.
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code={texts.code}
      title={texts.title}
      description={texts.description}
    >
      <Button onClick={() => retry()}>{texts.retry}</Button>
      <a
        href={`/${locale}`}
        className="text-fg-muted underline-offset-4 transition-colors duration-200 hover:text-fg hover:underline"
      >
        {texts.back}
      </a>
    </StatusPage>
  );
}
