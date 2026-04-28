import Link from "next/link";
import { Container } from "@/components/container";
import { DashboardPreviewCard } from "@/components/dashboard-preview-card";
import { HeroPreview } from "@/components/hero-preview";
import { PageIntro } from "@/components/page-intro";

const highlights = [
  {
    title: "Trade ROI",
    description:
      "Compare the realized value Vegas received against the value the club gave up in each deal."
  },
  {
    title: "Cap Efficiency",
    description:
      "Layer contract cost over performance to see which trades returned the most value per dollar committed."
  },
  {
    title: "Written Context",
    description:
      "Pair dashboards with a dedicated article slot for the project's written analysis."
  }
];

const previewCards = [
  {
    title: "Trade ROI Dashboard",
    description:
      "A quick view of overall trade returns, balancing value received against value sent out.",
    imageSrc: "/trade-roi-dashboard-preview.png",
    imageAlt: "Preview of the Trade ROI dashboard"
  },
  {
    title: "Cap Efficiency Dashboard",
    description:
      "A focused look at how contract cost and on-ice value interacted across the evaluated trade window.",
    imageSrc: "/cap-efficiency-dashboard-preview.png",
    imageAlt: "Preview of the Cap Efficiency dashboard"
  }
];

export default function VgkTradeRoiProjectPage() {
  return (
    <Container className="space-y-20 pb-20 pt-12 md:space-y-24 md:pt-16">
      <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="eyebrow">Project One</p>
            <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white md:text-6xl">
              VGK: Front Office Masterminds?
            </h1>
            <p className="lead max-w-2xl">
              A data-driven review of Vegas Golden Knights trades through realized on-ice value,
              future asset value, and cap efficiency.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-mist md:text-base">
              This project compares the value received by Vegas in each trade against the value
              given up, with the goal of creating a cleaner and more transparent way to study how
              those moves actually worked out over time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="panel p-5">
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-mist">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboards"
              className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
            >
              Explore Dashboards
            </Link>
            <Link
              href="/articles/vgk-trade-roi"
              className="inline-flex items-center justify-center rounded-full border border-gold/50 px-5 py-3 text-sm font-semibold text-white hover:border-gold hover:text-gold-bright"
            >
              Open Article
            </Link>
          </div>
        </div>

        <HeroPreview />
      </section>

      <section className="space-y-8">
        <PageIntro
          eyebrow="Dashboard Preview"
          title="A preview area for the project dashboards."
          description="This project keeps its dashboard-first presentation while now living inside the broader Golden Edge Analytics group."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {previewCards.map((card) => (
            <DashboardPreviewCard
              key={card.title}
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              imageAlt={card.imageAlt}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6 md:p-8">
          <p className="eyebrow">Related Articles</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
            One article slot for this project.
          </h2>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">
            Each project gets one article page. For VGK Trade ROI, the article space is in place
            now as a placeholder for the first full written release.
          </p>
          <div className="mt-6">
            <Link href="/articles/vgk-trade-roi" className="text-sm font-semibold text-gold-bright hover:text-white">
              Open article placeholder
            </Link>
          </div>
        </div>

        <div className="panel p-6 md:p-8">
          <p className="eyebrow">Project Positioning</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
            The first release from the group.
          </h2>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">
            Golden Edge Analytics is now the umbrella brand. VGK Trade ROI remains a dedicated
            project page and acts as the first example of how the group will package future work.
          </p>
          <div className="mt-6">
            <Link href="/projects" className="text-sm font-semibold text-gold-bright hover:text-white">
              Back to all projects
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
}
