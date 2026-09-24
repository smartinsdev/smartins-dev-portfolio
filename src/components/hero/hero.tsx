import { heroCards } from "@/data/hero-cards";
import { HeroGrid } from "./hero-grid";
import { HeroInfo } from "./hero-info";
import { HeroTitle } from "./hero-title";
import { ScrollHint } from "./scroll-hint";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-clip bg-stack-glow px-4 pt-[clamp(5.5rem,11svh,8.5rem)] pb-[clamp(4rem,9svh,6.5rem)]">
      <div className="@container flex w-full max-w-md flex-col items-center gap-[clamp(2.25rem,5svh,4rem)] md:w-[min(100%,calc(64svh*16/9))] md:max-w-none">
        <div className="relative w-full">
          <HeroGrid cards={heroCards} />
          <HeroTitle />
        </div>
        <HeroInfo />
      </div>
      <ScrollHint />
    </section>
  );
}
