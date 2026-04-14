import { SectionHeading } from "@/components/section-heading";

export function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel p-6 md:p-7">
      <SectionHeading title={title} />
      <p className="mt-3 text-sm leading-7 text-mist md:text-base">{body}</p>
    </div>
  );
}
