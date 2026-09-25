import { Fragment } from "react";
import { INTRO } from "@/animations/intro-targets";
import { site } from "@/data/site";
import { getDictionary } from "@/i18n/get-dictionary";

const words = site.name.split(" ");

export async function HeroTitle() {
  const dict = await getDictionary();

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-[clamp(3.25rem,calc(1.5rem+7cqi),8.5rem)] font-semibold leading-[0.95] tracking-tight text-fg title-glow">
        {words.map((word, index) => (
          <Fragment key={word}>
            {index > 0 && " "}
            <span
              data-intro={INTRO.titleWord}
              className="block md:inline-block"
            >
              {word}
            </span>
          </Fragment>
        ))}
      </h1>
      <p
        data-intro={INTRO.subtitle}
        className="mt-[clamp(0.75rem,1.6cqi,1.75rem)] text-[clamp(1.125rem,2.6cqi,2.75rem)] font-medium tracking-[-0.01em] subtitle-glow"
      >
        <span className="bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
          {dict.hero.role}
        </span>
      </p>
    </div>
  );
}
