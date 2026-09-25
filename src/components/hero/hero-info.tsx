import { INTRO } from "@/animations/intro-targets";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusDot } from "@/components/ui/status-dot";
import { site } from "@/data/site";
import { getDictionary } from "@/i18n/get-dictionary";

export async function HeroInfo() {
  const dict = await getDictionary();
  const [firstLine, ...otherLines] = dict.hero.tagline;

  return (
    <div className="grid w-full items-center gap-7 text-center md:grid-cols-3 md:gap-6 md:text-left">
      <p
        data-intro={INTRO.info}
        className="text-[clamp(1.125rem,2.4cqi,2.5rem)] font-semibold leading-[1.15] tracking-tight"
      >
        <span className="relative inline-block text-fg-muted">
          <span className="absolute top-1/2 right-full mr-[0.45em] flex -translate-y-1/2">
            <StatusDot />
          </span>
          {firstLine}
        </span>
        {otherLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <div
        data-intro={INTRO.info}
        className="flex justify-center text-[clamp(1rem,1.6cqi,1.625rem)]"
      >
        <ButtonLink href={site.ctaHref}>{dict.hero.cta}</ButtonLink>
      </div>

      <ul
        data-intro={INTRO.info}
        className="flex justify-center gap-6 font-mono text-[clamp(0.875rem,1.4cqi,1.375rem)] uppercase tracking-widest md:flex-col md:items-end md:gap-0"
      >
        {site.socials.map((social) => (
          <li key={social.href}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-11 items-center gap-[0.4em] text-fg-muted transition-colors duration-200 hover:text-highlight"
            >
              {social.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              >
                ↗
              </span>
              <span className="sr-only">{dict.hero.newTab}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
