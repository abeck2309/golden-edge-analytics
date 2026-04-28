import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { PodcastCurtain } from "@/components/podcast-curtain";
import { PodcastPlayerCard } from "@/components/podcast-player-card";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return siteConfig.podcasts.map((episode) => ({ slug: episode.slug }));
}

export default async function PodcastEpisodePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = siteConfig.podcasts.find((item) => item.slug === slug);

  if (!episode) {
    notFound();
  }

  return (
    <Container className="relative pb-20 pt-12 md:pt-16">
      <div className="podcast-curtain-shell space-y-12 md:space-y-16">
        <PageIntro
          eyebrow="Podcast Episode"
          title={episode.title}
          description={episode.description}
        />

        <PodcastPlayerCard episode={episode} />

        <div>
          <Link href="/podcasts" className="text-sm font-semibold text-gold-bright hover:text-white">
            Back to podcasts
          </Link>
        </div>
      </div>

      <PodcastCurtain
        title="The Podcast Room Stays Closed For Now"
        description="Audio features are still being refined. The full podcast experience will open once the launch version is ready to go live."
      />
    </Container>
  );
}
