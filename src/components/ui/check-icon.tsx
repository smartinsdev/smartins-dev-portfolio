import type { ComponentProps } from "react";

// Ícone "check" do Lucide (licença ISC). Aparece no lugar do de copiar
// quando a cópia deu certo; o aviso em texto fica ao lado.
export function CheckIcon(props: ComponentProps<"svg">) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
