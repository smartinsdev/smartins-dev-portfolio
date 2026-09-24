import type { ComponentProps } from "react";
import { buttonClassName } from "./button-styles";

export function ButtonLink({ className = "", ...props }: ComponentProps<"a">) {
  return <a className={`${buttonClassName} ${className}`} {...props} />;
}
