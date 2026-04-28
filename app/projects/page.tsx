import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { siteConfig } from "@/lib/site-config";

export default function ProjectsPage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Projects"
        title="Golden Knights Data Projects"
        description="View the library of new, state-of-the-art data projects designed for Golden Knights fans to take a deeper dive into the makeup of the former Stanley Cup champions."
      />

      <section className="grid gap-6">
        {siteConfig.projects.map((project) => (
          <article
            key={project.slug}
            className="panel grid overflow-hidden lg:grid-cols-[0.95fr_1.05fr]"
          >
            <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 shadow-[0_22px_60px_rgba(0,0,0,0.38)]">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  width={1400}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="eyebrow">{project.status}</p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white">
                {project.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-mist md:text-base">{project.summary}</p>
              <p className="mt-4 text-sm leading-7 text-mist md:text-base">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-bright"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href={project.href}
                  target={project.isExternal ? "_blank" : undefined}
                  rel={project.isExternal ? "noreferrer" : undefined}
                  className="inline-flex rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
                >
                  {project.isExternal ? "Open Project" : "View Project"}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </Container>
  );
}
