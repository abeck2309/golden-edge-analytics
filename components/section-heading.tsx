export function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-[0.03em] text-white md:text-[1.75rem]">
      {title}
    </h2>
  );
}
