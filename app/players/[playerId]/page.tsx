import Link from "next/link";
import { Container } from "@/components/container";
import { PlayerCareerTable } from "@/components/player-career-table";
import { getVgkPlayerCard } from "@/lib/nhl-api";

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function SeasonStatGrid({
  isGoalie,
  stats
}: {
  isGoalie: boolean;
  stats: Awaited<ReturnType<typeof getVgkPlayerCard>>["regularSeason"];
}) {
  if (isGoalie) {
    return (
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatBox label="GP" value={stats.gamesPlayed} />
        <StatBox label="Record" value={`${stats.wins}-${stats.losses}-${stats.otLosses}`} />
        <StatBox label="GAA" value={stats.goalsAgainstAvg} />
        <StatBox label="SV%" value={stats.savePctg} />
        <StatBox label="Shutouts" value={stats.shutouts} />
        <StatBox label="PIM" value={stats.pim} />
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <StatBox label="GP" value={stats.gamesPlayed} />
      <StatBox label="Goals" value={stats.goals} />
      <StatBox label="Assists" value={stats.assists} />
      <StatBox label="Points" value={stats.points} />
      <StatBox label="+/-" value={stats.plusMinus} />
      <StatBox label="Shots" value={stats.shots} />
    </div>
  );
}

export default async function PlayerPage({ params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params;
  const player = await getVgkPlayerCard(Number(playerId));

  return (
    <Container className="pb-20 pt-12 md:pt-16">
      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          {player.headshot ? (
            <img
              src={player.headshot}
              alt=""
              className="h-32 w-32 rounded-xl border border-white/10 bg-white/[0.04] object-cover"
            />
          ) : null}
          <div>
            <p className="eyebrow">GEA Player Profile</p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold text-white md:text-6xl">
              {player.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-mist md:text-base">
              #{player.sweaterNumber ?? "--"} | {player.position} | Age {player.age} | {player.team}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5 md:p-6">
          <p className="eyebrow">Regular Season</p>
          <SeasonStatGrid isGoalie={player.isGoalie} stats={player.regularSeason} />
        </div>

        <div className="panel p-5 md:p-6">
          <p className="eyebrow">Playoffs</p>
          <SeasonStatGrid isGoalie={player.isGoalie} stats={player.playoffs} />
        </div>
      </section>

      <section className="mt-6 panel p-5 md:p-6">
        <p className="eyebrow">Player Info</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox label="Height" value={player.height} />
          <StatBox label="Weight" value={player.weight} />
          <StatBox label="Shoots/Catches" value={player.shootsCatches} />
          <StatBox label="Birthplace" value={player.birthPlace || "N/A"} />
        </div>
      </section>

      <PlayerCareerTable isGoalie={player.isGoalie} seasons={player.careerBySeason} />

      <Link href="/vgk-updates" className="mt-6 inline-flex rounded-full border border-gold/30 px-5 py-3 text-sm font-semibold text-gold-bright hover:border-gold hover:text-white">
        Back to VGK Updates
      </Link>
    </Container>
  );
}
