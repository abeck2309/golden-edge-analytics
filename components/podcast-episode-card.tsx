import Link from "next/link";
import { PodcastEpisodeConfig } from "@/lib/site-config";

export function PodcastEpisodeCard({ episode }: { episode: PodcastEpisodeConfig }) {
  return (
    <article className="panel flex h-full flex-col p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{episode.label}</p>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">
          {episode.date}
        </span>
      </div>

      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
        {episode.title}
      </h2>
      <p className="mt-4 flex-1 text-sm leading-7 text-mist md:text-base">
        {episode.description}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">
          {episode.audioSrc ? episode.duration : "Audio soon"}
        </span>
        <Link
          href={`/podcasts/${episode.slug}`}
          className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold-bright hover:border-gold hover:text-white"
        >
          Open Episode
        </Link>
      </div>
    </article>
  );
}
