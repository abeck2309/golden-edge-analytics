export function NoteCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="panel p-6 md:p-7">
      <p className="eyebrow">Context Note</p>
      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-mist md:text-base">{text}</p>
    </article>
  );
}
