import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

export default function JetsComeCrashingDownInVegasArticlePage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Article"
        title="The Jets Come Crashing Down in Vegas"
        description="Vegas erupts for six goals at home and keeps its push for the Pacific Division title alive heading into the regular-season finale."
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
          <p className="text-sm text-mist">4/14/26</p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-8 text-mist md:text-base">
          <p>
            Goals galore for the Golden Knights in this one, as Vegas dropped six goals on
            Olympian Connor Hellebuyck en route to a 6-2 victory on home ice. Six different goal
            scorers, six goals on the board. Jack Eichel had himself a four-point night, and he
            also recorded his first power-play goal of the season in game 81 of 82.
          </p>

          <figure className="md:float-right md:mb-4 md:ml-6 md:mt-2 overflow-hidden rounded-[1.4rem] border border-line bg-white/[0.02] md:w-[320px]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/vgk-wpg-4-13-26.jpeg"
                alt="Golden Knights and Jets action from April 13, 2026"
                fill
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-line px-4 py-3 text-xs uppercase tracking-[0.14em] text-mist">
              NHL / Vegas Golden Knights
            </figcaption>
          </figure>

          <p>
            The second period was eventful to say the least, with the Jets and Golden Knights
            combining for seven penalties in the middle frame. Mark Stone changed the narrative,
            potting his first shorthanded goal of the season to start the scoring for Vegas.
            Towards the end of the second, Reilly Smith extended the Golden Knights&apos; lead by
            deflecting Noah Hanifin&apos;s shot after a pressure-filled shift in the Winnipeg end.
          </p>

          <p>
            The Golden Knights would explode for four goals in the third period. The Jets would
            get two goals of their own, but ultimately that would be it. Vegas put the nail in the
            coffin on Winnipeg&apos;s season, destroying their playoff hopes. Regardless of the
            result, Winnipeg would have been eliminated anyway due to the Kings grabbing the final
            wild-card spot in the Western Conference that night.
          </p>

          <p>
            Vegas now pursues home-ice advantage in the first round. All they need to do is win in
            any fashion against the Seattle Kraken on Wednesday and the Pacific Division title is
            theirs for the fifth time in franchise history. It felt like a wasted season and, at
            one point, all hope seemed lost, but Vegas has completely flipped the script. They are
            currently riding a nine-game point streak, which is the longest point streak they have
            had since 2023.
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
