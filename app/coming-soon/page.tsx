import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

const futureUpdates = [
  {
    title: "More Golden Knights coverage",
    description:
      "Future updates can include recurring Golden Knights analysis, quick-hit reaction pieces, and deeper feature stories."
  },
  {
    title: "Expanded article coverage",
    description:
      "That includes game recaps, coaching insights, player spotlights, and stat-focused articles alongside project work."
  },
  {
    title: "Ongoing refinements",
    description:
      "This page gives the site a clear place to preview what is next without crowding the live projects or article feed."
  }
];

export default function ComingSoonPage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Coming Soon"
        title="Future updates will live here."
        description="This page is the placeholder for the next round of Golden Edge Analytics releases, Golden Knights coverage, and site updates."
      />

      <section className="grid gap-6 lg:grid-cols-3">
        {futureUpdates.map((item) => (
          <div key={item.title} className="panel p-6 md:p-7">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              {item.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-mist md:text-base">{item.description}</p>
          </div>
        ))}
      </section>
    </Container>
  );
}
