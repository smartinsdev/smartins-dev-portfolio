import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site-url";
import { themeColors } from "@/lib/theme-colors";
import "./globals.css";

const title = `${site.name} — Portfólio`;
const description = `${site.role}. Portfólio de ${site.name}.`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: title, template: `%s — ${site.name}` },
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: title,
    title,
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: themeColors.ink900,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink-900 font-sans text-fg">
        {children}
      </body>
    </html>
  );
}
