import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

export default function GoldenKnightsVancouverArticlePage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Article"
        title="The Golden Knights Emerge Victorious Over Vancouver"
        description="Vegas finishes off the season series sweep of Vancouver and keeps its strong run under John Tortorella going."
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
          <p className="text-sm text-mist">4/8/26</p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-8 text-mist md:text-base">
          <p>
            On Tuesday, April 7th, the Golden Knights wrapped up the season series with the
            Vancouver Canucks, which ended up being a sweep for Vegas. Another crucial two points
            were on the line once again for Vegas coming into this one. In the latter half of the
            second period, the Golden Knights found themselves down 1-0 after Max Sasson snapped
            one past Carter Hart. Based on Hart&apos;s reaction, that was definitely a goal he
            wanted back, but thankfully for him that was the only goal he gave up that night.
          </p>

          <p>
            A couple of minutes later, with 4:14 left in the second period, Brayden McNabb through
            traffic provided the game-tying goal and leveled the game at 1 heading into the second
            intermission. The score did not show that Vegas dominated this game, but they
            definitely controlled the majority of the play in this one despite being tied 1-1
            after two periods of play.
          </p>

          <figure className="md:float-left md:mb-4 md:mr-6 md:mt-2 overflow-hidden rounded-[1.4rem] border border-line bg-white/[0.02] md:w-[320px]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/vgk-van-4-7-26.jpg"
                alt="Golden Knights and Canucks action from April 7, 2026"
                fill
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-line px-4 py-3 text-xs uppercase tracking-[0.14em] text-mist">
              The Canadian Press / Darryl Dyck
            </figcaption>
          </figure>

          <p>
            Recently the depth of the Golden Knights has been shown, and with 7:47 left in
            regulation Vegas&apos; fourth line connected for what would be the game-winning goal.
            Cole Smith stripped the puck away from Liam Ohgren at the blue line, and from there
            Vegas went to work. The two trade deadline acquisitions connected in the third period.
            Nic Dowd found Cole Smith in the slot and he potted his second goal as a Golden
            Knight.
          </p>

          <p>
            His goal would end up being the difference in this one. Rasmus Andersson took an
            interference penalty with 1:41 remaining in the third, and Vancouver pulled Tolopilo
            to make it a 6-on-4 man advantage. The Golden Knights were hemmed into their own zone
            for the remainder of the game, but Carter Hart stood tall and preserved the win. Vegas
            is now 4-0-0 under John Tortorella and will look to build off of that against the
            Seattle Kraken on April 9th.
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
