import type { ComponentProps } from "react";

// Ícone "monitor" do Lucide (licença ISC). Fica ao lado do texto
// "Sistema", que já diz o que é, então o SVG fica escondido.
export function MonitorIcon(props: ComponentProps<"svg">) {
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
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
