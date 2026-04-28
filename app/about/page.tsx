import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { siteConfig } from "@/lib/site-config";

function LinkIcon({ type }: { type: "linkedin" | "github" | "instagram" }) {
  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3Zm7 0h3.83v1.64h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.54c0-1.32-.03-3.02-1.84-3.02-1.85 0-2.13 1.45-2.13 2.93V21h-4Z" />
      </svg>
    );
  }

  if (type === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.73-1.33-1.73-1.09-.74.09-.72.09-.72 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.49.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.51.12-3.16 0 0 1.01-.33 3.3 1.23a11.39 11.39 0 0 1 6 0c2.29-1.56 3.29-1.23 3.29-1.23.67 1.65.26 2.86.13 3.16.78.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.65-5.48 5.95.43.38.81 1.11.81 2.24v3.32c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm9.5 1.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="About"
        title="About Golden Edge Analytics"
        description="A quick look at the person and ideas behind the site."
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
            About Me
          </h2>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">
            I'm a Northern California native and Vegas Golden Knights fan since their inaugural
            2017 season. I'm currently pursuing a B.S. in Business Administration (Accounting) at
            Stanislaus State, where I've developed a strong interest in data-driven analysis and
            decision-making.
          </p>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">
            My experience includes working as a Launch Intern at EY and as an incoming Internal
            Audit Intern at Santander, where I've built a foundation in structured analysis and
            risk evaluation. I'm proficient in Excel, SQL, R, and Tableau, and I'm continuing to
            expand my skills in Python.
          </p>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">
            I'm also the creator of the NHL Excellence Index (NEXI), a model designed to identify
            MVP performance using objective metrics and reduce voter bias. This project extends that
            same approach, combining hockey, analytics, and financial thinking to better evaluate
            the true impact of Vegas trades.
          </p>
        </div>

        <div className="panel p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
            Links
          </h2>
          <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-white">
            <Link
              href={siteConfig.links.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 hover:border-gold hover:text-gold-bright"
            >
              <LinkIcon type="linkedin" />
              LinkedIn
            </Link>
            <Link
              href={siteConfig.links.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 hover:border-gold hover:text-gold-bright"
            >
              <LinkIcon type="github" />
              GitHub
            </Link>
            <Link
              href={siteConfig.links.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 hover:border-gold hover:text-gold-bright"
            >
              <LinkIcon type="instagram" />
              Instagram
            </Link>
          </div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-mist md:text-base">
            <p>
              Golden Edge Analytics is the group behind this project, built around the idea that
              hockey decisions can be studied with the same structure, discipline, and clarity that
              strong analytical organizations bring to complex problems.
            </p>
            <p>
              We focus on combining data analysis, financial reasoning, and visual storytelling to
              evaluate Vegas Golden Knights roster decisions in a way that is rigorous, accessible,
              and useful to both casual fans and more analytically minded audiences.
            </p>
          </div>
        </div>
      </section>

      <section className="panel p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
            Get in touch
          </h2>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">
            If you want to connect about hockey analytics, Tableau work, modeling ideas, or future
            Golden Edge Analytics projects, feel free to reach out directly by email.
          </p>
          <div className="mt-5 flex flex-col items-start gap-3">
            <Link
              href={`mailto:${siteConfig.links.email}`}
              className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold-bright hover:border-gold hover:text-white"
            >
              Contact Me
            </Link>
            <p className="text-sm leading-6 text-mist">{siteConfig.links.email}</p>
          </div>
        </div>
      </section>
    </Container>
  );
}
