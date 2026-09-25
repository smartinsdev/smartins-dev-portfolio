import Image from "next/image";
import { INTRO } from "@/animations/intro-targets";
import type { HeroCardData } from "@/data/hero-cards";

const SIZES = "(min-width: 48rem) 25vw, 50vw";

export function HeroCard({ card }: { card: HeroCardData }) {
  return (
    <div
      data-intro={INTRO.card}
      style={{ gridArea: card.area }}
      className={`relative overflow-hidden rounded-sm ${card.desktopOnly ? "hidden md:block" : ""}`}
    >
      {/* Uma imagem por tema; o CSS mostra só a do tema atual. As duas
          carregam de cara (eager): a intro espera todas as <img>
          ficarem prontas, e uma imagem "preguiçosa" escondida nunca
          carregaria. São SVGs de 2 KB. */}
      <Image
        src={card.src}
        alt=""
        fill
        loading="eager"
        sizes={SIZES}
        className="object-cover light:hidden"
      />
      <Image
        src={card.lightSrc}
        alt=""
        fill
        loading="eager"
        sizes={SIZES}
        className="object-cover dark:hidden"
      />
    </div>
  );
}
