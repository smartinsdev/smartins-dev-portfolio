import { PROJECTS } from "@/animations/projects-targets";
import { projects } from "@/data/projects";
import { getDictionary } from "@/i18n/get-dictionary";
import { ProjectCard } from "./project-card";

// Margem lateral igual à da navbar: o título e o primeiro card ficam
// alinhados com a logo.
const GUTTER = "px-[clamp(1.25rem,3vw,5rem)]";

export async function Projects() {
  const dict = await getDictionary();
  // "04": a contagem com dois dígitos, como o número dos cards.
  const count = String(projects.length).padStart(2, "0");

  return (
    // O padding de cima é o mesmo do hero: quando a âncora #projects
    // leva o topo da seção ao topo da tela, a navbar fixa cobre só o
    // padding, e não o título.
    <section
      id="projects"
      aria-labelledby="projects-title"
      data-projects={PROJECTS.section}
      className="relative bg-projects-glow pt-[clamp(5.5rem,11svh,8.5rem)] pb-[clamp(4rem,9svh,6.5rem)]"
    >
      <div
        data-projects={PROJECTS.heading}
        className={`flex items-baseline gap-[0.6em] pb-[clamp(1.5rem,4svh,3rem)] ${GUTTER}`}
      >
        {/* tabIndex -1: não entra no Tab, mas pode receber o foco pelo
            código. O link #projects manda o foco para cá. */}
        <h2
          id="projects-title"
          tabIndex={-1}
          className="font-display text-[clamp(2.25rem,4.5vw,4.5rem)] font-semibold leading-none tracking-tight"
        >
          {dict.projects.title}
        </h2>
        {/* O <ol> já diz quantos são para o leitor de tela. */}
        <span
          aria-hidden="true"
          className="font-mono text-[clamp(0.875rem,1.1vw,1.375rem)] text-fg-muted"
        >
          ({count})
        </span>
      </div>

      <ol
        data-projects={PROJECTS.track}
        className={`relative grid gap-[clamp(1rem,2vw,2.5rem)] md:grid-cols-2 ${GUTTER}`}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </ol>
    </section>
  );
}
