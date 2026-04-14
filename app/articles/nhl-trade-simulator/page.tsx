import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

export default function NhlTradeSimulatorArticlePage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Project Article"
        title="NHL Trade Simulator Article"
        description="A coming-soon writeup for the live NHL Trade Simulator project."
      />

      <section className="panel p-6 md:p-8">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
          Coming soon
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-mist md:text-base">
          This article space is reserved for the writeup that will explain the NHL Trade Simulator,
          how it works, and what users can do in the live public-facing project.
        </p>
        <div className="mt-6">
          <Link href="/articles" className="text-sm font-semibold text-gold-bright hover:text-white">
            Back to articles
          </Link>
        </div>
      </section>
    </Container>
  );
}
