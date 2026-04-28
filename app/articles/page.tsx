import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";
import { siteConfig } from "@/lib/site-config";

export default function ArticlesPage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Articles"
        title="Golden Knights articles, recaps, and analysis."
        description="This section is broader than the project pages. It is where Golden Edge Analytics can publish Golden Knights writing such as game recaps, coaching insights, player analysis, stats pieces, and project-related articles."
      />

      <section className="grid gap-6 lg:grid-cols-2">
        {siteConfig.articles.map((article) => (
          <article key={article.slug} className="panel flex h-full flex-col p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">{article.eyebrow}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">
                {article.readTime}
              </span>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              {article.title}
            </h2>
            <p className="mt-4 flex-1 text-sm leading-7 text-mist md:text-base">
              {article.description}
            </p>
            <div className="mt-6">
              <Link
                href={article.href}
                className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold-bright hover:border-gold hover:text-white"
              >
                Read Article
              </Link>
            </div>
          </article>
        ))}
      </section>
    </Container>
  );
}
