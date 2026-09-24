"use client"; // Error boundaries precisam ser client components.

import { ErrorScreen } from "@/components/status/error-screen";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export default function GlobalError(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-ink-900 font-sans text-fg">
        <title>Algo deu errado</title>
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
