import { Hero } from "@/components/hero/hero";
import { Intro } from "@/components/intro/intro";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <Intro>
      <Navbar />
      <main>
        <Hero />
      </main>
    </Intro>
  );
}
