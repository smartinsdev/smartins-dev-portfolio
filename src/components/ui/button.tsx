import type { ComponentProps } from "react";
import { buttonClassName } from "./button-styles";

export function Button({
  className = "",
  type = "button",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={`${buttonClassName} cursor-pointer ${className}`}
      {...props}
    />
  );
}
