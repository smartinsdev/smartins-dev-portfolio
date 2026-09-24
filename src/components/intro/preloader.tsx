import { INTRO } from "@/animations/intro-targets";
import { Logo } from "@/components/ui/logo";

export function Preloader() {
  return (
    <div
      data-intro={INTRO.preloader}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stack-glow"
    >
      <Logo
        id="preloader-logo"
        className="h-auto w-[clamp(9rem,14vw,16rem)] motion-safe:animate-breathe"
      />
    </div>
  );
}
