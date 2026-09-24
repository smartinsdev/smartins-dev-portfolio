import Image from "next/image";
import { INTRO } from "@/animations/intro-targets";
import type { HeroCardData } from "@/data/hero-cards";

export function HeroCard({ card }: { card: HeroCardData }) {
  return (
    <div
      data-intro={INTRO.card}
      style={{ gridArea: card.area }}
      className={`relative overflow-hidden rounded-sm ${card.desktopOnly ? "hidden md:block" : ""}`}
    >
      <Image
        src={card.src}
        alt=""
        fill
        loading="eager"
        sizes="(min-width: 48rem) 25vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}
