import Image from "next/image";

export function HeroPreview() {
  return (
    <div className="panel relative overflow-hidden p-4 md:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,188,122,0.12),transparent_28%)]" />
      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_26px_70px_rgba(0,0,0,0.42)]">
        <Image
          src="/vgk-hero.png"
          alt="Preview image for the Vegas Golden Knights Trade ROI project"
          width={1400}
          height={950}
          className="h-auto w-full object-cover"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(7,9,11,0.88))] p-5 md:p-6">
          <p className="eyebrow">Featured Project</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-frost/90">
            Snapshot of the VGK Trade ROI experience, the first project inside the Golden Edge
            Analytics group.
          </p>
        </div>
      </div>
    </div>
  );
}
