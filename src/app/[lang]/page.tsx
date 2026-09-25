import { Hero } from "@/components/hero/hero";
import { Intro } from "@/components/intro/intro";
import { Navbar } from "@/components/layout/navbar";
import { Projects } from "@/components/projects/projects";

export default function HomePage() {
  return (
    <Intro>
      <Navbar />
      <main>
        <Hero />
        <Projects />
      </main>
    </Intro>
  );
}
