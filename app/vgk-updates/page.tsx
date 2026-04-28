import { Container } from "@/components/container";
import { VgkUpdatesDashboard } from "@/components/vgk-updates-dashboard";
import { getVgkUpdates } from "@/lib/nhl-api";

export const dynamic = "force-dynamic";

export default async function VgkUpdatesPage() {
  const data = await getVgkUpdates();

  return (
    <Container className="pb-20 pt-12 md:pt-16">
      <VgkUpdatesDashboard data={data} />
    </Container>
  );
}
