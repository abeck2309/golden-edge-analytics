"use client";

import { useMemo, useState } from "react";
import type { VgkPlayerCardData } from "@/lib/nhl-api";
import { cn } from "@/lib/cn";

type CareerSeason = VgkPlayerCardData["careerBySeason"][number];
type SeasonFilter = "both" | "regular" | "playoffs";

function parseTimeToSeconds(time: string) {
  if (!time || time === "N/A") return 0;
  const parts = time.split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function formatAverageTime(totalWeightedSeconds: number, gamesPlayed: number) {
  if (!gamesPlayed) return "N/A";
  const seconds = Math.round(totalWeightedSeconds / gamesPlayed);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatSavePctg(shotsAgainst: number, goalsAgainst: number, fallbackPctg: number) {
  if (shotsAgainst > 0) {
    return ((shotsAgainst - goalsAgainst) / shotsAgainst).toFixed(3).replace(/^0/, "");
  }

  return fallbackPctg > 0 ? fallbackPctg.toFixed(3).replace(/^0/, "") : ".000";
}

function buildCareerTotal(seasons: CareerSeason[], gameType: CareerSeason["gameType"]): CareerSeason | null {
  if (seasons.length === 0) return null;

  const gamesPlayed = seasons.reduce((total, season) => total + season.gamesPlayed, 0);
  const shotsAgainst = seasons.reduce((total, season) => total + season.shotsAgainst, 0);
  const goalsAgainst = seasons.reduce((total, season) => total + season.goalsAgainst, 0);
  const weightedAtoiSeconds = seasons.reduce(
    (total, season) => total + parseTimeToSeconds(season.avgToi) * season.gamesPlayed,
    0
  );
  const weightedGaa = seasons.reduce(
    (total, season) => total + Number(season.goalsAgainstAvg || 0) * season.gamesPlayed,
    0
  );
  const weightedSavePctg = seasons.reduce(
    (total, season) => total + Number(`0${season.savePctg}`) * season.gamesPlayed,
    0
  );

  return {
    season: "Career",
    gameType,
    team: "NHL",
    gamesPlayed,
    goals: seasons.reduce((total, season) => total + season.goals, 0),
    assists: seasons.reduce((total, season) => total + season.assists, 0),
    points: seasons.reduce((total, season) => total + season.points, 0),
    plusMinus: seasons.reduce((total, season) => total + season.plusMinus, 0),
    pim: seasons.reduce((total, season) => total + season.pim, 0),
    shots: seasons.reduce((total, season) => total + season.shots, 0),
    avgToi: formatAverageTime(weightedAtoiSeconds, gamesPlayed),
    gamesStarted: seasons.reduce((total, season) => total + season.gamesStarted, 0),
    wins: seasons.reduce((total, season) => total + season.wins, 0),
    losses: seasons.reduce((total, season) => total + season.losses, 0),
    otLosses: seasons.reduce((total, season) => total + season.otLosses, 0),
    goalsAgainstAvg: gamesPlayed > 0 ? (weightedGaa / gamesPlayed).toFixed(2) : "0.00",
    savePctg: formatSavePctg(shotsAgainst, goalsAgainst, gamesPlayed > 0 ? weightedSavePctg / gamesPlayed : 0),
    shutouts: seasons.reduce((total, season) => total + season.shutouts, 0),
    shotsAgainst,
    goalsAgainst
  };
}

export function PlayerCareerTable({ isGoalie, seasons }: { isGoalie: boolean; seasons: CareerSeason[] }) {
  const [filter, setFilter] = useState<SeasonFilter>("both");

  const filteredSeasons = useMemo(() => {
    if (filter === "regular") return seasons.filter((season) => season.gameType === "Regular Season");
    if (filter === "playoffs") return seasons.filter((season) => season.gameType === "Playoffs");
    return seasons;
  }, [filter, seasons]);

  const careerTotal = useMemo(() => {
    const totalGameType = filter === "playoffs" ? "Playoffs" : "Regular Season";
    const totalSeasons = seasons.filter((season) => season.gameType === totalGameType);
    return buildCareerTotal(totalSeasons, totalGameType);
  }, [filter, seasons]);

  return (
    <section className="mt-6 panel p-5 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="eyebrow">Career By Season</p>
        <div className="flex flex-wrap gap-2">
          {[
            ["both", "Both"],
            ["regular", "Regular Season"],
            ["playoffs", "Playoffs"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as typeof filter)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === value
                  ? "border-gold/60 bg-gold/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-mist hover:border-gold/40 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs font-semibold uppercase tracking-[0.16em] text-mist">
            <tr>
              <th className="px-4 py-3">Season</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-right">GP</th>
              {isGoalie ? (
                <>
                  <th className="px-4 py-3 text-right">GS</th>
                  <th className="px-4 py-3 text-right">W</th>
                  <th className="px-4 py-3 text-right">L</th>
                  <th className="px-4 py-3 text-right">OTL</th>
                  <th className="px-4 py-3 text-right">GAA</th>
                  <th className="px-4 py-3 text-right">SV%</th>
                  <th className="px-4 py-3 text-right">SO</th>
                  <th className="px-4 py-3 text-right">SA</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-right">G</th>
                  <th className="px-4 py-3 text-right">A</th>
                  <th className="px-4 py-3 text-right">PTS</th>
                  <th className="px-4 py-3 text-right">+/-</th>
                  <th className="px-4 py-3 text-right">PIM</th>
                  <th className="px-4 py-3 text-right">SOG</th>
                  <th className="px-4 py-3 text-right">ATOI</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredSeasons.map((season) => (
              <tr key={`${season.season}-${season.gameType}-${season.team}`} className="border-t border-white/10 text-frost">
                <td className="px-4 py-3 font-semibold text-white">{season.season}</td>
                <td className="px-4 py-3 text-mist">{season.gameType}</td>
                <td className="px-4 py-3">{season.team}</td>
                <td className="px-4 py-3 text-right">{season.gamesPlayed}</td>
                {isGoalie ? (
                  <>
                    <td className="px-4 py-3 text-right">{season.gamesStarted}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gold-bright">{season.wins}</td>
                    <td className="px-4 py-3 text-right">{season.losses}</td>
                    <td className="px-4 py-3 text-right">{season.otLosses}</td>
                    <td className="px-4 py-3 text-right">{season.goalsAgainstAvg}</td>
                    <td className="px-4 py-3 text-right">{season.savePctg}</td>
                    <td className="px-4 py-3 text-right">{season.shutouts}</td>
                    <td className="px-4 py-3 text-right">{season.shotsAgainst}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-right">{season.goals}</td>
                    <td className="px-4 py-3 text-right">{season.assists}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gold-bright">{season.points}</td>
                    <td className="px-4 py-3 text-right">{season.plusMinus}</td>
                    <td className="px-4 py-3 text-right">{season.pim}</td>
                    <td className="px-4 py-3 text-right">{season.shots}</td>
                    <td className="px-4 py-3 text-right">{season.avgToi}</td>
                  </>
                )}
              </tr>
            ))}
            {careerTotal ? (
              <tr className="border-t border-gold/40 bg-gold/10 font-semibold text-gold-bright">
                <td className="px-4 py-3">Career</td>
                <td className="px-4 py-3">{careerTotal.gameType}</td>
                <td className="px-4 py-3">{careerTotal.team}</td>
                <td className="px-4 py-3 text-right">{careerTotal.gamesPlayed}</td>
                {isGoalie ? (
                  <>
                    <td className="px-4 py-3 text-right">{careerTotal.gamesStarted}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.wins}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.losses}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.otLosses}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.goalsAgainstAvg}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.savePctg}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.shutouts}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.shotsAgainst}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-right">{careerTotal.goals}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.assists}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.points}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.plusMinus}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.pim}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.shots}</td>
                    <td className="px-4 py-3 text-right">{careerTotal.avgToi}</td>
                  </>
                )}
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
