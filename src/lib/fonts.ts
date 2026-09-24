import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

// para trocar a fonte do site, basta mudar o import aqui.
// O resto do projeto usa as classes
// `font-display`, `font-sans` e `font-mono` (ver globals.css).

export const displayFont = localFont({
  src: "../assets/fonts/source-serif-4-opsz-600-latin.woff2",
  weight: "600",
  variable: "--font-display-family",
  adjustFontFallback: "Times New Roman",
});

export const bodyFont = Geist({
  subsets: ["latin"],
  variable: "--font-body-family",
});

export const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-family",
  preload: false,
});

export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
].join(" ");
