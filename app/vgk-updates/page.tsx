import { Container } from "@/components/container";
import { VgkUpdatesDashboard } from "@/components/vgk-updates-dashboard";
import { getVgkUpdates } from "@/lib/nhl-api";

export const dynamic = "force-dynamic";

export default async function VgkUpdatesPage() {
  let data;

  try {
    data = await getVgkUpdates();
  } catch {
    return (
      <Container className="pb-20 pt-12 md:pt-16">
        <section className="panel p-6 md:p-8">
          <p className="eyebrow">VGK Updates</p>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-white md:text-5xl">
            NHL data is cooling down
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-mist md:text-base">
            The NHL API is rate limiting live requests right now. Give it a short minute and refresh the page.
          </p>
        </section>
      </Container>
    );
  }

  return (
    <Container className="pb-20 pt-12 md:pt-16">
      <VgkUpdatesDashboard data={data} />
    </Container>
  );
}
