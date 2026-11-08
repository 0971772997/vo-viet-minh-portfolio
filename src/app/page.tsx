import Nav from "@/components/Nav";
import Effects from "@/components/Effects";
import Particles from "@/components/Particles";
import Hero from "@/components/Hero";
import { Marquee, About, Skills, Projects, Experience, Certificates, Contact } from "@/components/Sections";
import { getProjects, getExperiences, getCertificates } from "@/lib/db";

export default async function Home() {
  const [projects, experiences, certificates] = await Promise.all([
    getProjects(),
    getExperiences(),
    getCertificates(),
  ]);

  return (
    <>
      <Effects />
      <Particles />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects list={projects} />
        <Experience list={experiences} />
        <Certificates list={certificates} />
        <Contact />
      </main>
      <footer className="foot">© {new Date().getFullYear()} Võ Viết Minh</footer>
    </>
  );
}
