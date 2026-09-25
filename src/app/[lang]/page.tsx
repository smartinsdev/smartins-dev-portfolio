import { Hero } from "@/components/hero/hero";
import { Intro } from "@/components/intro/intro";
import { Navbar } from "@/components/layout/navbar";
import { Projects } from "@/components/projects/projects";
import { ProjectsStage } from "@/components/projects/projects-stage";

export default function HomePage() {
  return (
    <Intro>
      <Navbar />
      <main>
        <ProjectsStage>
          <Hero />
          <Projects />
        </ProjectsStage>
      </main>
    </Intro>
  );
}
