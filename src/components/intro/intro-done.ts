import { createContext, useContext } from "react";

/**
 * `true` quando a intro terminou. Quem só deve ligar depois dela (ex.: a
 * luz que segue o mouse) lê com `useIntroDone()`, sem precisar saber
 * nada da timeline. O componente <Intro> é quem fornece o valor.
 */
export const IntroDoneContext = createContext(false);

export function useIntroDone() {
  return useContext(IntroDoneContext);
}
