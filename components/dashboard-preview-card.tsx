import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";

export function DashboardPreviewCard({
  title,
  description,
  imageSrc,
  imageAlt
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="p-5">
        <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 shadow-[0_22px_60px_rgba(0,0,0,0.38)]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1400}
            height={900}
            className="h-auto w-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-2 px-5 pb-5">
        <SectionHeading title={title} />
        <p className="text-sm leading-6 text-mist">{description}</p>
        <Link
          href="/dashboards"
          aria-label={`View ${title} details on the dashboards page`}
          className="inline-flex pt-2 text-sm font-semibold text-gold-bright hover:text-white"
        >
          View dashboards
        </Link>
      </div>
    </div>
  );
}
