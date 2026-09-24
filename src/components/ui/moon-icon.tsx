import type { ComponentProps } from "react";

// Ícone "moon" do Lucide (licença ISC). Fica ao lado do texto "Escuro",
// que já diz o que é, então o SVG fica escondido.
export function MoonIcon(props: ComponentProps<"svg">) {
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
