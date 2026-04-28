"use client";

import { useMemo, useState } from "react";
import type { VgkPlayerCardData } from "@/lib/nhl-api";
import { cn } from "@/lib/cn";

type CareerSeason = VgkPlayerCardData["careerBySeason"][number];

export function PlayerCareerTable({ isGoalie, seasons }: { isGoalie: boolean; seasons: CareerSeason[] }) {
  const [filter, setFilter] = useState<"both" | "regular" | "playoffs">("both");

  const filteredSeasons = useMemo(() => {
    if (filter === "regular") return seasons.filter((season) => season.gameType === "Regular Season");
    if (filter === "playoffs") return seasons.filter((season) => season.gameType === "Playoffs");
    return seasons;
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
          </tbody>
        </table>
      </div>
    </section>
  );
}
