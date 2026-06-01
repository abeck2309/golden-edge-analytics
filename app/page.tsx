import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { cn } from "@/lib/cn";
import { stanleyCupFinalMode } from "@/lib/finals-mode";
import { getVgkUpdates, type VgkUpdatesData } from "@/lib/nhl-api";

export const dynamic = "force-dynamic";

const logoAliases: Record<string, string> = {
  NJD: "N.J",
  TBL: "T.B"
};

function logoSrc(abbrev: string) {
  return `/${logoAliases[abbrev] ?? abbrev}.svg`;
}

const editorialRows = [
  {
    label: "Articles",
    title: "Recaps, player breakdowns, coaching thoughts, and stats-led pieces.",
    description:
      "The writing side of Golden Edge Analytics is meant to stand on its own, not just support project pages.",
    href: "/articles",
    cta: "Read the coverage"
  },
  {
    label: "Quizzes",
    title: "Faster interactive fan prompts, trivia, and shareable results.",
    description:
      "Quizzes give Golden Edge Analytics a lighter lane for Golden Knights trivia, player matches, roster scenarios, and quick fan engagement.",
    href: "/quizzes",
    cta: "Try the quizzes"
  },
  {
    label: "Projects",
    title: "Bigger visual and model-driven analysis when the idea needs more room.",
    description:
      "Interactive work like VGK Trade ROI and the NHL Trade Simulator lives here, along with future long-form builds and dashboards.",
    href: "/projects",
    cta: "Browse projects"
  },
  {
    label: "Next",
    title: "A site built to keep growing with the team, the season, and the analysis.",
    description:
      "Coming Soon is where future formats, updates, and new ideas can take shape without boxing the brand in.",
    href: "/coming-soon",
    cta: "See what is next"
  }
];

function formatGameDate(value: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...options
  }).format(new Date(value));
}

function HomeGamePanel({ data }: { data: VgkUpdatesData | null }) {
  if (!data) {
    return (
      <section className="panel mt-8 p-5 md:p-6">
        <p className="eyebrow">VGK Game</p>
        <p className="mt-3 text-sm text-mist">Game data is temporarily unavailable.</p>
      </section>
    );
  }

  const featured = data.overview.featuredGame;
  const showFeatured = featured?.isToday;
  const nextGame = data.overview.nextGame;
  const latestGame = data.overview.latestGame;
  const label = showFeatured ? featured.label : nextGame ? "Next Game" : "Latest Game";
  const opponentAbbrev = showFeatured ? featured.opponentAbbrev : nextGame?.opponentAbbrev;
  const opponentName = showFeatured ? featured.opponent : nextGame?.opponent;
  const homeAway = showFeatured ? featured.homeAway : nextGame?.homeAway;
  const date = showFeatured ? featured.date : nextGame?.date ?? latestGame.date;
  const score = showFeatured ? featured.score : nextGame ? null : latestGame.score;
  const status = showFeatured ? featured.status : nextGame?.status ?? latestGame.result;
  const isFinalsOpponent = opponentAbbrev === stanleyCupFinalMode.opponentAbbrev;
  const finalsMode = stanleyCupFinalMode.enabled && isFinalsOpponent;
  const panelLabel = finalsMode ? "Cup Final Game Center" : label;

  return (
    <section
      className={cn(
        "panel mt-8 overflow-hidden p-5 md:p-6",
        finalsMode && "border-gold/35 bg-[radial-gradient(circle_at_18%_0%,rgba(185,151,91,0.22),transparent_32%),linear-gradient(135deg,rgba(12,16,21,0.96),rgba(14,10,12,0.96))] shadow-[0_0_38px_rgba(185,151,91,0.14)]"
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">{finalsMode ? stanleyCupFinalMode.roundLabel : "VGK Game"}</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-white md:text-4xl">
            {panelLabel}
          </h2>
          <p className="mt-2 text-sm text-mist md:text-base">
            {formatGameDate(date)}
            {homeAway ? ` | ${homeAway}` : ""}
            {status ? ` | ${status}` : ""}
          </p>
          {finalsMode ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gold-bright">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(200,16,46,0.95)]" />
              {stanleyCupFinalMode.matchupLabel}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <Image src="/VGK.svg" alt="" width={52} height={52} className="h-12 w-12 object-contain" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-bright">Vegas</p>
              <p className="font-bold text-white">Golden Knights</p>
            </div>
          </div>
          <div className="text-center font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
            {score ?? "VS"}
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
            {opponentAbbrev ? (
              <Image src={logoSrc(opponentAbbrev)} alt="" width={52} height={52} className="h-12 w-12 object-contain" />
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-bright">Opponent</p>
              <p className="font-bold text-white">{opponentName ?? latestGame.opponent}</p>
            </div>
          </div>
        </div>

        <Link
          href="/vgk-updates#live-game"
          className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
        >
          Open Game Center
        </Link>
      </div>
    </section>
  );
}

export default async function HomePage() {
  let vgkData: VgkUpdatesData | null = null;

  try {
    vgkData = await getVgkUpdates();
  } catch {
    vgkData = null;
  }

  return (
    <Container className="pb-24 pt-8 md:pt-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1015]">
        <div className="relative aspect-[16/12] min-h-[620px] w-full md:aspect-[16/10] lg:min-h-[720px]">
          <Image
            src="/vgk-intro.jpg"
            alt="Golden Knights analysis landing page visual"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.2),rgba(5,7,9,0.55)_38%,rgba(5,7,9,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,188,122,0.2),transparent_26%)]" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
            <div className="max-w-4xl space-y-6">
              <p className="eyebrow">Golden Edge Analytics</p>
              <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-[4.25rem]">
                A Home for Golden Knights Analysis
              </h1>
              <p className="max-w-3xl text-base leading-8 text-frost/88 md:text-xl">
                Golden Edge Analytics is built to cover the Golden Knights from multiple angles:
                articles, project work, player analysis, coaching insight, roster questions, and
                stats-driven storytelling.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
                >
                  Enter the Articles
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:border-gold/50 hover:text-gold-bright"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeGamePanel data={vgkData} />

      <section className="grid gap-10 px-2 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <p className="eyebrow">What This Is</p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-5xl">
            A broader place for Golden Knights coverage.
          </h2>
          <p className="max-w-xl text-sm leading-8 text-mist md:text-base">
            The goal is to give Golden Knights analysis a single home. Some work fits best as an
            article, some as a larger project, and some as something in between.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.6rem] border border-line bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright">
              Coverage
            </p>
            <p className="mt-3 text-lg font-semibold text-white">Recaps, trends, and player focus</p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright">
              Perspective
            </p>
            <p className="mt-3 text-lg font-semibold text-white">Coaching, roster construction, and team direction</p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-white/[0.03] p-5 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-bright">
              Format
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              Some ideas work better as written analysis. Others need a full project, with visuals,
              data, and more room to build them out.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-6">
        {editorialRows.map((item, index) => (
          <article
            key={item.label}
            className={`grid gap-6 border-b border-white/10 py-8 md:py-10 lg:grid-cols-[180px_1fr_auto] lg:items-start ${
              index === 0 ? "border-t" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-bright">
              {item.label}
            </p>
            <div className="space-y-3">
              <h2 className="max-w-3xl font-[family-name:var(--font-heading)] text-2xl font-semibold text-white md:text-4xl">
                {item.title}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-mist md:text-base">{item.description}</p>
            </div>
            <div className="lg:pt-2">
              <Link
                href={item.href}
                target={"isExternal" in item && item.isExternal ? "_blank" : undefined}
                rel={"isExternal" in item && item.isExternal ? "noreferrer" : undefined}
                className="inline-flex items-center justify-center rounded-full border border-gold/30 px-5 py-3 text-sm font-semibold text-gold-bright hover:border-gold hover:text-white"
              >
                {item.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-8 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <p className="eyebrow">Featured Work</p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-5xl">
            The NHL Trade Simulator is now live as a full public-facing trade lab.
          </h2>
          <p className="max-w-2xl text-sm leading-8 text-mist md:text-base">
            It gives fans a fully functioning interactive way to explore league-wide trade ideas,
            modeled outcomes, and roster-building scenarios in a more hands-on format.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link
            href="https://goldenedgeanalytics-nhltradesim.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
          >
            Open Trade Lab
          </Link>
          <Link
            href="/articles/nhl-trade-simulator"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:border-gold/40 hover:text-gold-bright"
          >
            Read the article
          </Link>
        </div>
      </section>
    </Container>
  );
}
