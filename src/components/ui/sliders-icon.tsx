import type { ComponentProps } from "react";

// Ícone "sliders-horizontal" do Lucide (licença ISC). O botão que usa o
// ícone é quem tem o nome acessível, então o SVG fica escondido.
export function SlidersIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
    </svg>
  );
}
