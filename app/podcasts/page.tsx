import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { PodcastCurtain } from "@/components/podcast-curtain";
import { PodcastEpisodeCard } from "@/components/podcast-episode-card";
import { siteConfig } from "@/lib/site-config";

export default function PodcastsPage() {
  return (
    <Container className="relative pb-20 pt-12 md:pt-16">
      <div className="podcast-curtain-shell space-y-12 md:space-y-16">
        <PageIntro
          eyebrow="Podcasts"
          title="Golden Knights audio, episode by episode."
          description="Browse podcast episodes here, then open each one into its own player page with full playback controls and a reactive waveform."
        />

        <section className="grid gap-6 lg:grid-cols-2">
          {siteConfig.podcasts.map((episode) => (
            <PodcastEpisodeCard key={episode.slug} episode={episode} />
          ))}
        </section>
      </div>

      <PodcastCurtain />
    </Container>
  );
}
