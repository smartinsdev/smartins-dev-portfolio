import { INTRO } from "@/animations/intro-targets";
import type { HeroCardData } from "@/data/hero-cards";
import { HeroCard } from "./hero-card";
import styles from "./hero-grid.module.css";

export function HeroGrid({ cards }: { cards: HeroCardData[] }) {
  return (
    <div
      data-intro={INTRO.grid}
      className={`${styles.grid} aspect-3/4 w-full rounded-xl bg-ink-800 p-[clamp(0.5rem,1.2cqi,1.25rem)] ring-1 ring-line md:aspect-video`}
    >
      {cards.map((card) => (
        <HeroCard key={card.src} card={card} />
      ))}
    </div>
  );
}
