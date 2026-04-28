"use client";

import { Container } from "@/components/container";

export default function VgkUpdatesError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="pb-20 pt-12 md:pt-16">
      <section className="panel p-6 md:p-8">
        <p className="eyebrow">VGK Updates</p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white">
          NHL data is unavailable
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-mist">
          The public NHL API request failed. Try again in a moment.
        </p>
        <p className="mt-3 break-all text-xs text-mist/80">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
        >
          Retry
        </button>
      </section>
    </Container>
  );
}
