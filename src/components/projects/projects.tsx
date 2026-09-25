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
  const [lead, highlight] = dict.projects.headline;

  return (
    // Dois layouts, escolhidos pelo CSS (variante cinema: do globals.css):
    // - estático: a seção vem depois do hero, com os cards em grade. O
    //   padding de cima é o do hero, então a navbar fixa cobre só o
    //   padding quando a âncora #projects leva a seção ao topo da tela.
    // - cinema: a seção fica em cima do hero, com a altura da tela, presa
    //   ao pé do palco (self-end), invisível (opacity-0) e sem receber
    //   cliques; a fileira vira uma linha só (flex + w-max), centralizada
    //   na altura que sobra (my-auto). O projects-scroll.ts anima o resto.
    <section
      id="projects"
      aria-labelledby="projects-title"
      data-projects={PROJECTS.section}
      className="relative bg-projects-glow pt-[clamp(5.5rem,11svh,8.5rem)] pb-[clamp(4rem,9svh,6.5rem)] cinema:pointer-events-none cinema:flex cinema:h-svh cinema:flex-col cinema:self-end cinema:pb-[clamp(1.25rem,4svh,3rem)] cinema:opacity-0"
    >
      <div
        data-projects={PROJECTS.heading}
        className={`pb-[clamp(1.5rem,4svh,3rem)] ${GUTTER}`}
      >
        {/* tabIndex -1: não entra no Tab, mas pode receber o foco pelo
            código. O link #projects manda o foco para cá. O leitor de tela
            lê o título inteiro: "Projetos: Do rascunho ao deploy". */}
        <h2
          id="projects-title"
          tabIndex={-1}
          className="flex flex-col gap-[clamp(0.5rem,1.5svh,1rem)]"
        >
          {/* Etiqueta: o mesmo nome do link da navbar, para a pessoa saber
              onde chegou. */}
          <span className="flex items-baseline gap-[0.6em] font-mono text-[clamp(0.8125rem,min(1vw,2svh),1.125rem)] uppercase tracking-widest text-fg-muted">
            {dict.projects.title}
            {/* O <ol> já diz quantos são para o leitor de tela. */}
            <span aria-hidden="true">({count})</span>
          </span>
          <span className="sr-only">: </span>
          {/* Abaixo de 640px (sm) a fonte segue a largura (9vw, até 36px)
              para a frase caber numa linha até em 320px: duas linhas
              roubariam a altura que o modo cinema precisa para os cards.
              text-balance: se ainda quebrar (fonte maior, outro idioma), as
              linhas ficam com tamanhos parecidos. */}
          <span className="font-display text-[clamp(1.75rem,9vw,2.25rem)] font-semibold leading-[1.05] tracking-tight text-balance sm:text-[clamp(2.25rem,min(4.5vw,9svh),4.5rem)]">
            {lead}{" "}
            <span className="bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
              {highlight}
            </span>
          </span>
        </h2>
      </div>

      <ol
        data-projects={PROJECTS.track}
        className={`relative grid gap-[clamp(1rem,2vw,2.5rem)] md:grid-cols-2 ${GUTTER} cinema:my-auto cinema:flex cinema:w-max cinema:will-change-transform`}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </ol>
    </section>
  );
}
