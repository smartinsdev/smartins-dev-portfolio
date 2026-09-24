import type { Metadata } from "next";
import { StatusPage } from "@/components/status/status-page";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Página não encontrada"
      description="O endereço pode ter mudado ou nunca ter existido."
    >
      <ButtonLink href="/">Voltar para o início</ButtonLink>
    </StatusPage>
  );
}
