"use client";

import { useMemo, useState } from "react";
import type { MoneyPuckPlayerShotChart } from "@/lib/moneypuck-api";
import { cn } from "@/lib/cn";

type ShotFilter = "all" | "regular" | "playoffs" | "goals";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function PlayerShotChart({ chart }: { chart: MoneyPuckPlayerShotChart }) {
  const [filter, setFilter] = useState<ShotFilter>("all");
  const filteredShots = useMemo(() => {
    if (filter === "regular") return chart.shots.filter((shot) => !shot.isPlayoffGame);
    if (filter === "playoffs") return chart.shots.filter((shot) => shot.isPlayoffGame);
    if (filter === "goals") return chart.shots.filter((shot) => shot.goal);
    return chart.shots;
  }, [chart.shots, filter]);

  const filteredGoals = filteredShots.filter((shot) => shot.goal).length;
  const filteredXGoals = filteredShots.reduce((sum, shot) => sum + shot.xGoal, 0);

  return (
    <section className="mt-6 panel p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">MoneyPuck Shot Map</p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
            Player Shot Chart
          </h2>
          <p className="mt-2 text-sm leading-6 text-mist">
            Current-season shots from MoneyPuck. Goals glow gold; marker size scales with xG.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["regular", "Regular"],
            ["playoffs", "Playoffs"],
            ["goals", "Goals"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as ShotFilter)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                filter === value
                  ? "border-gold bg-gold text-ink"
                  : "border-white/15 bg-white/[0.03] text-mist hover:border-gold/40 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Shots</p>
          <p className="mt-2 text-2xl font-bold text-white">{filteredShots.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Goals</p>
          <p className="mt-2 text-2xl font-bold text-white">{filteredGoals}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">xG</p>
          <p className="mt-2 text-2xl font-bold text-white">{filteredXGoals.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3 md:p-4">
        <style jsx>{`
          @keyframes player-goal-pulse {
            0%,
            100% {
              opacity: 0.45;
              transform: scale(0.78);
            }
            50% {
              opacity: 1;
              transform: scale(1.45);
            }
          }

          .player-goal-pulse {
            animation: player-goal-pulse 1.65s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
        `}</style>
        <svg
          className="block aspect-[1.85/1] w-full overflow-visible"
          viewBox="0 -42.5 100 85"
          role="img"
          aria-label="Player shot location chart"
        >
          <defs>
            <clipPath id={`player-shot-rink-${chart.playerId}`}>
              <path d="M 0 -42.5 H 72 A 28 28 0 0 1 100 -14.5 V 14.5 A 28 28 0 0 1 72 42.5 H 0 Z" />
            </clipPath>
            <filter id={`player-shot-goal-glow-${chart.playerId}`} x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2.3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g clipPath={`url(#player-shot-rink-${chart.playerId})`}>
            <rect x="0" y="-42.5" width="100" height="85" fill="#f8fbff" />
            <path d="M 0 -42.5 V 42.5" stroke="#c82333" strokeWidth="0.9" />
            <path d="M 25 -42.5 V 42.5" stroke="#2563eb" strokeWidth="1.25" />
            <path d="M 89 -42.5 V 42.5" stroke="#c82333" strokeWidth="0.9" />
            <path d="M 89 -11 L 100 -14 M 89 11 L 100 14" stroke="#c82333" strokeWidth="0.6" />
            <path d="M 89 -7 H 100 M 89 7 H 100" stroke="#c82333" strokeWidth="0.45" strokeDasharray="1 1" opacity="0.55" />
            <path d="M 89 -4 H 83 A 6 6 0 0 0 83 4 H 89 Z" fill="#bfdbfe" fillOpacity="0.7" stroke="#2563eb" strokeWidth="0.65" />
            <rect x="90.2" y="-3" width="3.4" height="6" rx="0.5" fill="#c82333" />

            <g fill="none" stroke="#c82333" strokeWidth="0.7">
              <circle cx="69" cy="-22" r="15" />
              <circle cx="69" cy="22" r="15" />
              <path d="M 63 -32 H 67 M 71 -32 H 75 M 63 -12 H 67 M 71 -12 H 75" />
              <path d="M 63 12 H 67 M 71 12 H 75 M 63 32 H 67 M 71 32 H 75" />
            </g>
            <g fill="#c82333">
              <circle cx="69" cy="-22" r="1.3" />
              <circle cx="69" cy="22" r="1.3" />
            </g>

            <g fill="none" stroke="#94a3b8" strokeWidth="0.35" opacity="0.38">
              <path d="M 0 -21.25 H 100 M 0 0 H 100 M 0 21.25 H 100" />
              <path d="M 50 -42.5 V 42.5 M 75 -42.5 V 42.5" />
            </g>

            {filteredShots.map((shot, index) => {
              const x = clamp(shot.x, 0, 100);
              const y = clamp(shot.y, -42.5, 42.5);
              const radius = clamp(1.5 + shot.xGoal * 16, 1.8, 5.4);

              return (
                <g key={`${shot.gameId}-${shot.period}-${shot.time}-${index}`}>
                  {shot.goal ? (
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 2.8}
                      fill="#d8bc7a"
                      opacity="0.48"
                      className="player-goal-pulse"
                    />
                  ) : null}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={shot.goal ? "#d8bc7a" : "#111827"}
                    stroke={shot.goal ? "#111827" : "#d8bc7a"}
                    strokeWidth="0.55"
                    opacity={shot.goal ? 0.95 : 0.62}
                    filter={shot.goal ? `url(#player-shot-goal-glow-${chart.playerId})` : undefined}
                  >
                    <title>
                      {shot.goal ? "Goal" : "Shot"} | {shot.shotType} | xG {shot.xGoal.toFixed(3)} | Period {shot.period}{" "}
                      {formatTime(shot.time)} | vs {shot.goalieName}
                    </title>
                  </circle>
                </g>
              );
            })}
          </g>

          <path
            d="M 0 -42.5 H 72 A 28 28 0 0 1 100 -14.5 V 14.5 A 28 28 0 0 1 72 42.5 H 0 Z"
            fill="none"
            stroke="#d8bc7a"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <p className="mt-3 text-xs leading-5 text-mist">
        {chart.credit} Updated from source: {new Date(chart.lastUpdated).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}.
      </p>
    </section>
  );
}
