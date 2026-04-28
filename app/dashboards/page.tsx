import { Container } from "@/components/container";
import { DashboardEmbedCard } from "@/components/dashboard-embed-card";
import { PageIntro } from "@/components/page-intro";
import { DashboardConfig, siteConfig } from "@/lib/site-config";

const dashboardSections: DashboardConfig[] = [
  siteConfig.dashboards.tradeRoi,
  siteConfig.dashboards.capEfficiency
];

export default function DashboardsPage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Dashboards"
        title="The main dashboard hub for the project."
        description="The sections below embed each Tableau Public dashboard directly on the page while still offering a direct open-in-Tableau option."
      />

      <section className="space-y-6">
        {dashboardSections.map((section) => (
          <DashboardEmbedCard
            key={section.title}
            title={section.title}
            description={section.description}
            url={section.url}
            embedUrl={section.embedUrl}
          />
        ))}
      </section>
    </Container>
  );
}
