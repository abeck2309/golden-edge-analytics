import { Container } from "@/components/container";

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <section className={`panel animate-pulse p-6 ${className}`}>
      <div className="h-3 w-28 rounded-full bg-white/10" />
      <div className="mt-4 h-8 w-2/3 rounded-full bg-white/10" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="h-24 rounded-xl bg-white/10" />
        <div className="h-24 rounded-xl bg-white/10" />
      </div>
    </section>
  );
}

export default function VgkUpdatesLoading() {
  return (
    <Container className="pb-20 pt-12 md:pt-16">
      <SkeletonCard />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SkeletonCard className="lg:col-span-2" />
        <SkeletonCard />
      </div>
    </Container>
  );
}
