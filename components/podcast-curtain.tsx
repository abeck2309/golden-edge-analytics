export function PodcastCurtain({
  title = "Podcasts Are Under Wraps",
  description = "The podcast section is being built behind the scenes and will open when everything is ready for a full release."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl rounded-[2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(9,11,16,0.96),rgba(20,12,16,0.96))] p-8 text-center shadow-[0_0_60px_rgba(216,188,122,0.12)] backdrop-blur-xl md:p-12">
        <p className="eyebrow">Under Wraps</p>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-mist md:text-base">
          {description}
        </p>
        <div className="mx-auto mt-8 h-px w-full max-w-md bg-[linear-gradient(90deg,transparent,rgba(216,188,122,0.65),transparent)]" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright/90">
          Golden Edge Analytics
        </p>
      </div>
    </div>
  );
}
