import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";

export function DashboardEmbedCard({
  title,
  description,
  url,
  embedUrl
}: {
  title: string;
  description: string;
  url: string;
  embedUrl: string;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-6 py-5 md:px-8">
        <SectionHeading title={title} />
        <p className="mt-2 max-w-3xl text-sm leading-6 text-mist">{description}</p>
      </div>

      <div className="space-y-5 p-6 md:p-8">
        <div className="overflow-hidden rounded-2xl border border-line bg-steel shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            className="h-[820px] w-full bg-steel md:h-[840px]"
          />
        </div>

        <div className="flex justify-start">
          <Link
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title} - open in Tableau in a new tab`}
            className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-bright hover:border-gold hover:text-white"
          >
            Open in Tableau
          </Link>
        </div>
      </div>
    </div>
  );
}
