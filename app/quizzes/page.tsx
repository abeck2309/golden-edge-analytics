import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

const quizzesUrl = "https://goldenedgeanalytics-quizzes.vercel.app/";

export default function QuizzesPage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Quizzes"
        title="Golden Knights Quizzes"
        description="Golden Edge Quizzes is the interactive companion site for faster VGK trivia and fan challenges. Start from here, then jump into the dedicated quiz experience."
      />

      <section className="panel grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Featured Quiz</p>
            <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-mist">
              20 questions
            </span>
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-5xl">
            Reliving the 2023 Stanley Cup Run
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-mist md:text-base">
            A typed-answer quiz covering playoff moments, Cup-clinching details, and deeper cuts
            from the Golden Knights&apos; championship run.
          </p>
        </div>

        <Link
          href={quizzesUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
        >
          Open Quiz Site
        </Link>
      </section>
    </Container>
  );
}
