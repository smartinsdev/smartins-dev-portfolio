import { PROJECTS } from "@/animations/projects-targets";
import type { ProjectData } from "@/data/projects";
import { getDictionary } from "@/i18n/get-dictionary";

type ProjectCardProps = {
  project: ProjectData;
  /** Posição na fileira, a partir de 0. Vira o "01", "02"... */
  index: number;
};

export async function ProjectCard({ project, index }: ProjectCardProps) {
  const dict = await getDictionary();
  const { name, description } = dict.projects.items[project.id];
  const year =
    project.year === "ongoing" ? dict.projects.ongoing : project.year;
  const linkText =
    project.link.kind === "site"
      ? dict.projects.viewSite
      : dict.projects.viewCode;

  // No modo cinema a largura vem da tela, e não do texto: ~85% no
  // celular, ~60% no tablet e ~34% a partir de 1280px (entre 1024 e
  // 1279px, 34% deixaria o card estreito e alto demais para a tela).
  // Assim a fileira sempre passa da tela (tem o que andar) e a medida não
  // muda quando as fontes carregam. O pointer-events-auto religa o
  // clique que a seção desliga.
  //
  // Tamanhos em min(Xvw, 2X·svh): crescem com a largura, como no resto do
  // site, mas param de crescer numa tela mais de 2× mais larga que alta
  // (ex.: 1920×640). Sem isso o card fica mais alto que a tela e o modo
  // cinema cortaria o pé dele.
  return (
    <li
      data-projects={PROJECTS.card}
      className="relative flex flex-col rounded-xl bg-surface p-[clamp(1.25rem,min(2.2vw,4.4svh),2.5rem)] ring-1 ring-line transition-colors duration-200 has-[a:focus-visible]:ring-highlight has-[a:hover]:ring-highlight cinema:pointer-events-auto cinema:w-[85vw] cinema:shrink-0 cinema:md:w-[60vw] cinema:xl:w-[34vw]"
    >
      <div className="flex items-baseline justify-between gap-4">
        {/* Decorativo: a ordem já vem do <ol>. */}
        <span
          aria-hidden="true"
          className="bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text font-display text-[clamp(2.5rem,min(4vw,8svh),4.5rem)] font-semibold leading-none text-transparent"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[clamp(0.75rem,min(0.85vw,1.7svh),1.0625rem)] uppercase tracking-widest text-fg-muted">
          {year}
        </span>
      </div>

      <h3 className="mt-[clamp(1rem,3svh,2.5rem)] font-display text-[clamp(1.5rem,min(2.2vw,4.4svh),2.75rem)] font-semibold leading-tight tracking-tight">
        {name}
      </h3>
      <p className="mt-[0.75em] text-[clamp(0.875rem,min(0.95vw,1.9svh),1.25rem)] leading-relaxed text-fg-muted">
        {description}
      </p>

      <ul
        aria-label={dict.projects.stack}
        className="mt-auto flex flex-wrap gap-2 pt-[clamp(1.25rem,3svh,2rem)]"
      >
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full px-[0.85em] py-[0.3em] font-mono text-[clamp(0.75rem,min(0.8vw,1.6svh),1rem)] text-fg-muted ring-1 ring-line"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-[clamp(1rem,2.5svh,1.75rem)] border-t border-line pt-[clamp(0.5rem,1.5svh,1rem)]">
        {/* O ::after (after:absolute after:inset-0) estica a área de
            clique do link até cobrir o card inteiro, que é o `relative`
            mais próximo. Continua sendo um link só para o leitor de tela,
            com o nome "Ver site, Almeytour (abre em nova aba)". */}
        <a
          href={project.link.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex min-h-11 items-center gap-[0.4em] text-[clamp(1rem,min(1.1vw,2.2svh),1.375rem)] font-medium text-fg transition-colors duration-200 after:absolute after:inset-0 after:rounded-xl hover:text-highlight"
        >
          {linkText}
          <span className="sr-only">, {name}</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
          <span className="sr-only">{dict.hero.newTab}</span>
        </a>
      </div>
    </li>
  );
}
