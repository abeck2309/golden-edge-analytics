import Link from "next/link";
import { ArticleImage } from "@/components/article-image";
import { ArticlePlayerLink } from "@/components/article-player-link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

export default function TortorellaEffectArticlePage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Article"
        title="The Tortorella Effect"
        description="A look at how Vegas has responded in John Tortorella's first stretch behind the bench."
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
          <p className="text-sm text-mist">4/6/26</p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-8 text-mist md:text-base">
          <p>
            Ever since John Tortorella was hired by the Vegas Golden Knights on March 29th, 2026,
            the Golden Knights have gone a perfect 3-0-0 during his head coaching tenure with
            Vegas. You could argue that beating the Vancouver Canucks and Calgary Flames is not a
            big accomplishment, but Vegas beat the teams they were supposed to beat and that is all
            that matters. It does not really matter who you beat, especially when the Stanley Cup
            Playoffs are looming just a couple weeks away.
          </p>

          <p>
            John Tortorella has talked a lot about pace. The Golden Knights have implemented that
            into their game ever since his hiring. The firing of Bruce Cassidy was unexpected, but
            it was bound to happen eventually. Cassidy is among the best coaches in the league, if
            not the best in the league, but it was time for a new voice in the Golden Knights
            locker room.
          </p>

          <ArticleImage
            src="/tortorella-vgk.jpg"
            alt="John Tortorella with Vegas Golden Knights branding"
            credit="Stephen R. Sylvanie / Imagn Images"
            figureClassName="md:float-right md:mb-4 md:ml-6 md:mt-2 overflow-hidden rounded-[1.4rem] border border-line bg-white/[0.02] md:w-[320px]"
            aspectClassName="aspect-[4/3]"
          />

          <p>
            On Saturday, April 4th, the Golden Knights were set to face their arch nemesis, the
            Edmonton Oilers, on the road. This was by far the biggest game of the season for the
            Golden Knights, and they delivered. The Golden Knights never had a lead over the
            Oilers this season until Saturday night. That game was by far one of the most complete
            60-minute efforts Vegas has had all season long.{" "}
            <ArticlePlayerLink playerId={8478468}>Jeremy Lauzon</ArticlePlayerLink> ended up scoring his
            first goal as a Golden Knight, and his first in two years. Vegas was super effective
            off the rush, which is something they have been lacking all season long, and it paid
            off all game.
          </p>

          <p>
            <ArticlePlayerLink playerId={8479394}>Carter Hart</ArticlePlayerLink>, after missing nearly three months, was excellent against Edmonton.{" "}
            <ArticlePlayerLink playerId={8479394}>Hart</ArticlePlayerLink>
            backstopped his team to a 5-1 win, making 31 saves in the process. Vegas will need
            Hart to be exceptional in the final stretch of games. With just five games left to go
            in the regular season, the Golden Knights winning the Pacific Division does not sound
            too crazy anymore as they currently sit one point behind the Ducks for first.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/articles" className="text-sm font-semibold text-gold-bright hover:text-white">
            Back to articles
          </Link>
        </div>
      </section>
    </Container>
  );
}
