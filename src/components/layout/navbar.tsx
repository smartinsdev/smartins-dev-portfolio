import { INTRO } from "@/animations/intro-targets";
import { Logo } from "@/components/ui/logo";
import { site } from "@/data/site";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-[clamp(1.25rem,3vw,5rem)] py-[clamp(1rem,2.6svh,2.5rem)]">
      {/* Na intro, a logo do preloader voa até aqui e é trocada por esta.
          O header não pode ser animado: a logo mudaria de lugar. */}
      <a href="/" data-intro={INTRO.navLogo} className="inline-flex">
        <Logo
          id="navbar-logo"
          className="h-[clamp(2rem,2.5vw,3.5rem)] w-auto"
        />
        <span className="sr-only">{site.name}</span>
      </a>

      <nav data-intro={INTRO.nav} aria-label="Principal">
        <ul className="flex gap-[clamp(0.25rem,1.2vw,2rem)] text-[clamp(0.875rem,0.85vw,1.125rem)] font-medium">
          {site.nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-11 items-center px-[0.6em] text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
