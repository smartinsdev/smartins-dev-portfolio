import type { Metadata } from "next";
import { StatusPage } from "@/components/status/status-page";
import { ButtonLink } from "@/components/ui/button-link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

// O not-found não recebe `params`, mas next/root-params não precisa deles:
// getDictionary() descobre o idioma sozinho.
export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.notFound.title };
}

export default async function NotFound() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <StatusPage
      code="404"
      title={dict.notFound.title}
      description={dict.notFound.description}
    >
      <ButtonLink href={`/${locale}`}>{dict.notFound.back}</ButtonLink>
    </StatusPage>
  );
}
