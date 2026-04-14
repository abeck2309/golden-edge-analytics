import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

const editorialRows = [
  {
    label: "Articles",
    title: "Recaps, player breakdowns, coaching thoughts, and stats-led pieces.",
    description:
      "The writing side of Golden Edge Analytics is meant to stand on its own, not just support project pages.",
    href: "/articles",
    cta: "Read the coverage"
  },
  {
    label: "Projects",
    title: "Bigger visual and model-driven analysis when the idea needs more room.",
    description:
      "Interactive work like VGK Trade ROI and the NHL Trade Simulator lives here, along with future long-form builds and dashboards.",
    href: "/projects",
    cta: "Browse projects"
  },
  {
    label: "Next",
    title: "A site built to keep growing with the team, the season, and the analysis.",
    description:
      "Coming Soon is where future formats, updates, and new ideas can take shape without boxing the brand in.",
    href: "/coming-soon",
    cta: "See what is next"
  }
];

export default function HomePage() {
  return (
    <Container className="pb-24 pt-8 md:pt-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1015]">
        <div className="relative aspect-[16/12] min-h-[620px] w-full md:aspect-[16/10] lg:min-h-[720px]">
          <Image
            src="/vgk-intro.jpg"
            alt="Golden Knights analysis landing page visual"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.2),rgba(5,7,9,0.55)_38%,rgba(5,7,9,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,188,122,0.2),transparent_26%)]" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
            <div className="max-w-4xl space-y-6">
              <p className="eyebrow">Golden Edge Analytics</p>
              <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-[4.25rem]">
                A Home for Golden Knights Analysis
              </h1>
              <p className="max-w-3xl text-base leading-8 text-frost/88 md:text-xl">
                Golden Edge Analytics is built to cover the Golden Knights from multiple angles:
                articles, project work, player analysis, coaching insight, roster questions, and
                stats-driven storytelling.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
                >
                  Enter the Articles
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:border-gold/50 hover:text-gold-bright"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 px-2 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <p className="eyebrow">What This Is</p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-5xl">
            A broader place for Golden Knights coverage.
          </h2>
          <p className="max-w-xl text-sm leading-8 text-mist md:text-base">
            The goal is to give Golden Knights analysis a single home. Some work fits best as an
            article, some as a larger project, and some as something in between.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.6rem] border border-line bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright">
              Coverage
            </p>
            <p className="mt-3 text-lg font-semibold text-white">Recaps, trends, and player focus</p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright">
              Perspective
            </p>
            <p className="mt-3 text-lg font-semibold text-white">Coaching, roster construction, and team direction</p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-white/[0.03] p-5 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright">
              Format
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              Some ideas work better as written analysis. Others need a full project, with visuals,
              data, and more room to build them out.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-6">
        {editorialRows.map((item, index) => (
          <article
            key={item.label}
            className={`grid gap-6 border-b border-white/10 py-8 md:py-10 lg:grid-cols-[180px_1fr_auto] lg:items-start ${
              index === 0 ? "border-t" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-bright">
              {item.label}
            </p>
            <div className="space-y-3">
              <h2 className="max-w-3xl font-[family-name:var(--font-heading)] text-2xl font-semibold text-white md:text-4xl">
                {item.title}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-mist md:text-base">{item.description}</p>
            </div>
            <div className="lg:pt-2">
              <Link
                href={item.href}
                className="inline-flex items-center justify-center rounded-full border border-gold/30 px-5 py-3 text-sm font-semibold text-gold-bright hover:border-gold hover:text-white"
              >
                {item.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-8 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <p className="eyebrow">Featured Work</p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-5xl">
            The NHL Trade Simulator is now live as a full public-facing trade lab.
          </h2>
          <p className="max-w-2xl text-sm leading-8 text-mist md:text-base">
            It gives fans a fully functioning interactive way to explore league-wide trade ideas,
            modeled outcomes, and roster-building scenarios in a more hands-on format.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link
            href="https://goldenedgeanalytics-nhltradesim.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
          >
            Open Trade Lab
          </Link>
          <Link
            href="/articles/nhl-trade-simulator"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:border-gold/40 hover:text-gold-bright"
          >
            Read the article
          </Link>
        </div>
      </section>
    </Container>
  );
}
