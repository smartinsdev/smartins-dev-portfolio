import { INTRO } from "@/animations/intro-targets";
import { Logo } from "@/components/ui/logo";

/**
 * Fundo e logo ficam em camadas separadas: o fundo some enquanto a logo
 * voa até a navbar, por cima de tudo.
 */
export function Preloader() {
  return (
    <>
      <div
        data-intro={INTRO.preloader}
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-stack-glow"
      />
      {/* pointer-events-none: esta camada cobre a tela toda, mas nunca
          bloqueia cliques. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      >
        <Logo
          id="preloader-logo"
          data-intro={INTRO.preloaderLogo}
          className="h-auto w-[clamp(9rem,14vw,16rem)]"
        />
      </div>
    </>
  );
}
