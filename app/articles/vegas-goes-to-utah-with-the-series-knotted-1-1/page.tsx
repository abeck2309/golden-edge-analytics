import Link from "next/link";
import { ArticleImage } from "@/components/article-image";
import { ArticlePlayerLink } from "@/components/article-player-link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

export default function VegasUtahSeriesArticlePage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Article"
        title="Vegas Goes to Utah with the Series Knotted 1-1"
        description="Vegas splits the first two games at T-Mobile Arena and now heads to Salt Lake City for Utah's first ever home playoff game."
      />

      <section className="panel p-6 md:p-8">
        <div className="space-y-2 border-b border-line pb-6">
          <p className="text-sm font-semibold text-gold-bright">
            Written by: Jayden,{" "}
            <Link
              href="https://www.instagram.com/knights_insight/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              @knights_insight
            </Link>
          </p>
          <p className="text-sm text-mist">4/23/26</p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-8 text-mist md:text-base">
          <p>
            The Golden Knights split the first two games at T-Mobile Arena against the Utah
            Mammoth. Vegas took game one 4-2 thanks to{" "}
            <ArticlePlayerLink playerId={8475343}>Nic Dowd</ArticlePlayerLink>&apos;s go-ahead
            tip-in goal with 12:40 remaining in the third period. In game one Vegas did a solid job limiting Utah and
            slowing them down, but that was not the case in game two.
          </p>

          <ArticleImage
            src="/hart-save.webp"
            alt="Carter Hart making a save for the Golden Knights"
            credit="AP Photo / John Locher"
            figureClassName="md:float-left md:mb-4 md:mr-6 md:mt-2 w-full max-w-[320px] overflow-hidden rounded-[1.4rem] border border-line bg-white/[0.02]"
            aspectClassName="aspect-[4/3]"
          />

          <p>
            In game two Utah killed Vegas with their speed and yet again Utah's first line of
            <ArticlePlayerLink playerId={8482699}>Guenther</ArticlePlayerLink>-
            <ArticlePlayerLink playerId={8483431}>Cooley</ArticlePlayerLink>-
            <ArticlePlayerLink playerId={8479977}>Yamamoto</ArticlePlayerLink> was the difference in this game.{" "}
            <ArticlePlayerLink playerId={8483431}>Logan Cooley</ArticlePlayerLink> has had himself
            a fantastic start to the series, scoring two goals including the game winner in game
            two with six minutes left in regulation. The Mammoth's first line had an xG of 95.6%
            in game two. If Vegas wants to win this series they have to find a way to shut down
            <ArticlePlayerLink playerId={8483431}>Logan Cooley</ArticlePlayerLink>&apos;s line.
          </p>

          <p>
            Going into game three tomorrow, Vegas looks to take control of the series in Salt Lake
            City, in what will be Utah's first ever home playoff game. The Golden Knights have
            been in this situation numerous times. Can they prevail and drown out the noise
            they'll be up against in games three and four?
          </p>
        </div>

        <div className="clear-both mt-8">
          <Link href="/articles" className="text-sm font-semibold text-gold-bright hover:text-white">
            Back to articles
          </Link>
        </div>
      </section>
    </Container>
  );
}
