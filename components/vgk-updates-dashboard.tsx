"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { VgkGameDetail, VgkPlayerCardData, VgkUpdatesData } from "@/lib/nhl-api";
import { cn } from "@/lib/cn";

const logoAliases: Record<string, string> = {
  NJD: "N.J",
  TBL: "T.B"
};

function logoSrc(abbrev: string) {
  return `/${logoAliases[abbrev] ?? abbrev}.png`;
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options
  }).format(new Date(value));
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function detailScoreLine(detail: VgkGameDetail | null) {
  if (!detail) {
    return null;
  }

  const vgkTeam = detail.awayTeam.abbrev === "VGK" ? detail.awayTeam : detail.homeTeam;
  const opponent = detail.awayTeam.abbrev === "VGK" ? detail.homeTeam : detail.awayTeam;

  return `VGK ${vgkTeam.score}, ${opponent.abbrev} ${opponent.score}`;
}

type GoalEvent = VgkGameDetail["scoringByPeriod"][number]["goals"][number];

function formatShotType(value?: string) {
  if (!value) {
    return "N/A";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatZone(value?: string) {
  if (value === "O") return "Offensive zone";
  if (value === "D") return "Defensive zone";
  if (value === "N") return "Neutral zone";
  return value ?? "N/A";
}

function SectionCard({
  children,
  className = "",
  eyebrow,
  title
}: {
  children: React.ReactNode;
  className?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className={`panel p-5 md:p-6 ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PlayerNameButton({
  children,
  playerId,
  onOpen
}: {
  children: React.ReactNode;
  playerId?: number;
  onOpen: (playerId: number) => void;
}) {
  if (!playerId) return <>{children}</>;

  return (
    <button
      type="button"
      onClick={() => onOpen(playerId)}
      className="text-left font-semibold text-white underline decoration-gold/40 underline-offset-4 hover:text-gold-bright"
    >
      {children}
    </button>
  );
}

function PlayerCardDrawer({
  error,
  loading,
  onClose,
  player
}: {
  error: string | null;
  loading: boolean;
  onClose: () => void;
  player: VgkPlayerCardData | null;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close player card" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-[#090c10] p-5 shadow-2xl md:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">GEA Player Card</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm font-semibold text-mist hover:border-gold/40 hover:text-white"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="mt-6 grid animate-pulse gap-4">
            <div className="h-28 rounded-xl bg-white/10" />
            <div className="h-44 rounded-xl bg-white/10" />
          </div>
        ) : error ? (
          <p className="mt-6 text-sm leading-7 text-mist">{error}</p>
        ) : player ? (
          <>
            <div className="mt-6 flex gap-4">
              {player.headshot ? (
                <img
                  src={player.headshot}
                  alt=""
                  className="h-24 w-24 rounded-xl border border-white/10 bg-white/[0.04] object-cover"
                />
              ) : null}
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
                  {player.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-mist">
                  #{player.sweaterNumber ?? "--"} | {player.position} | {player.teamAbbrev}
                </p>
                <p className="text-sm leading-6 text-mist">
                  Age {player.age} | {player.height} | {player.weight} | {player.shootsCatches}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PlayerStatSummary isGoalie={player.isGoalie} label="Regular Season" stats={player.regularSeason} />
              <PlayerStatSummary isGoalie={player.isGoalie} label="Playoffs" stats={player.playoffs} />
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Last 5 Games</p>
              <div className="mt-3 space-y-2">
                {player.lastFiveGames.map((game) => (
                  <div key={game.gameId} className="grid grid-cols-[1fr_0.7fr_0.9fr] gap-2 text-sm">
                    <span className="text-mist">{game.date}</span>
                    <span>{game.opponent}</span>
                    <span className="text-right text-white">
                      {player.isGoalie
                        ? `${game.decision ?? "-"} | ${game.goalsAgainst} GA | ${game.savePctg}`
                        : `${game.goals}G ${game.assists}A`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/players/${player.playerId}`}
              className="mt-6 inline-flex w-fit rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-bright"
            >
              View Full Profile
            </Link>
          </>
        ) : null}
      </aside>
    </div>
  );
}

function PlayerStatSummary({
  isGoalie,
  label,
  stats
}: {
  isGoalie: boolean;
  label: string;
  stats: VgkPlayerCardData["regularSeason"];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-bright">{label}</p>
      {isGoalie ? (
        <>
          <p className="mt-3 text-2xl font-bold text-white">
            {stats.wins}-{stats.losses}-{stats.otLosses}
          </p>
          <p className="text-sm text-mist">
            {stats.goalsAgainstAvg} GAA | {stats.savePctg} SV% | {stats.shutouts} SO
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 text-2xl font-bold text-white">{stats.points} PTS</p>
          <p className="text-sm text-mist">
            {stats.goals}G {stats.assists}A in {stats.gamesPlayed} GP
          </p>
        </>
      )}
    </div>
  );
}

function LeaderBox({
  eyebrow,
  gamesPlayed,
  leaders,
  onOpenPlayer
}: {
  eyebrow: string;
  gamesPlayed: number;
  leaders: VgkUpdatesData["leaderGroups"]["regularSeason"]["leaders"];
  onOpenPlayer: (playerId: number) => void;
}) {
  return (
    <SectionCard eyebrow={eyebrow} title={`${gamesPlayed} GP`}>
      <div className="grid gap-3">
        {leaders.map((leader) => (
          <div key={leader.label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">{leader.label}</p>
              <p className="mt-1 text-lg font-bold text-white">
                <PlayerNameButton playerId={leader.playerId} onOpen={onOpenPlayer}>
                  {leader.name}
                </PlayerNameButton>
              </p>
            </div>
            <p className="text-3xl font-bold text-gold-bright">{leader.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function GameDetailPanel({
  detail,
  error,
  loading,
  goalPopup,
  onCloseGoalPopup,
  onOpenPlayer
}: {
  detail: VgkGameDetail | null;
  error: string | null;
  loading: boolean;
  goalPopup: GoalEvent | null;
  onCloseGoalPopup: () => void;
  onOpenPlayer: (playerId: number) => void;
}) {
  if (loading) {
    return (
      <section className="panel p-6">
        <p className="eyebrow">Game Detail</p>
        <div className="mt-5 grid animate-pulse gap-4">
          <div className="h-24 rounded-xl bg-white/10" />
          <div className="h-40 rounded-xl bg-white/10" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel p-6">
        <p className="eyebrow">Game Detail</p>
        <p className="mt-4 text-sm leading-7 text-mist">{error}</p>
      </section>
    );
  }

  if (!detail) {
    return (
      <section className="panel p-6">
        <p className="eyebrow">Game Detail</p>
        <p className="mt-4 text-sm leading-7 text-mist">Pick a game below to load the full game view.</p>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden p-5 md:p-6">
      {goalPopup ? (
        <div className="mb-5 rounded-2xl border border-gold/40 bg-[#100d05]/95 p-4 shadow-[0_0_35px_rgba(216,188,122,0.18)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-3">
              <Image
                src={logoSrc(goalPopup.teamAbbrev)}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 object-contain"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-bright">
                  Goal Alert
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                  {goalPopup.teamAbbrev} Goal, {goalPopup.score}
                </h3>
                <p className="mt-2 text-sm leading-6 text-mist">
                  <PlayerNameButton playerId={goalPopup.scorerPlayerId} onOpen={onOpenPlayer}>
                    {goalPopup.scorer}
                  </PlayerNameButton>{" "}
                  scored goal #{goalPopup.scorerTotal} at {goalPopup.timeRemaining} remaining in {goalPopup.periodLabel}.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCloseGoalPopup}
              className="w-fit rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-mist hover:border-gold/40 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Shot Type</p>
              <p className="mt-1 font-bold text-white">{formatShotType(goalPopup.shotType)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Zone</p>
              <p className="mt-1 font-bold text-white">{formatZone(goalPopup.zoneCode)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Against</p>
              <p className="mt-1 font-bold text-white">{goalPopup.goalieName}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Location</p>
              <p className="mt-1 font-bold text-white">
                {typeof goalPopup.xCoord === "number" && typeof goalPopup.yCoord === "number"
                  ? `x ${goalPopup.xCoord}, y ${goalPopup.yCoord}`
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm leading-6 text-mist">
            {goalPopup.assists.length ? (
              <>
                Assisted by{" "}
                {goalPopup.assists.map((assist, index) => (
                  <span key={`${assist.playerId}-${assist.name}`}>
                    {index > 0 ? ", " : ""}
                    <PlayerNameButton playerId={assist.playerId} onOpen={onOpenPlayer}>
                      {assist.name}
                    </PlayerNameButton>{" "}
                    ({assist.total})
                  </span>
                ))}
              </>
            ) : (
              "Unassisted goal."
            )}
            {goalPopup.highlightUrl ? (
              <a
                href={goalPopup.highlightUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-2 font-semibold text-gold-bright underline decoration-gold/40 underline-offset-4"
              >
                Watch highlight
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex items-center gap-4">
          <Image src={logoSrc(detail.awayTeam.abbrev)} alt="" width={74} height={74} className="h-16 w-16 object-contain md:h-20 md:w-20" />
          <div>
            <p className="eyebrow">Away</p>
            <h2 className="mt-1 text-xl font-bold text-white">{detail.awayTeam.abbrev}</h2>
            <p className="text-sm text-mist">{detail.awayTeam.name}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gold/25 bg-gold/10 px-5 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">
            {formatDate(detail.date)}
          </p>
          <p className="mt-1 font-[family-name:var(--font-heading)] text-4xl font-bold text-white">
            {detail.awayTeam.score} - {detail.homeTeam.score}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-bright">{detail.periodResult}</p>
        </div>

        <div className="flex items-center gap-4 md:justify-end">
          <div className="text-left md:text-right">
            <p className="eyebrow">Home</p>
            <h2 className="mt-1 text-xl font-bold text-white">{detail.homeTeam.abbrev}</h2>
            <p className="text-sm text-mist">{detail.homeTeam.name}</p>
          </div>
          <Image src={logoSrc(detail.homeTeam.abbrev)} alt="" width={74} height={74} className="h-16 w-16 object-contain md:h-20 md:w-20" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatTile label="Away Shots" value={detail.awayTeam.shots} />
        <StatTile label="Home Shots" value={detail.homeTeam.shots} />
        <StatTile label="VGK Side" value={detail.vgk.side === "home" ? "Home" : "Away"} />
        <StatTile label="Game State" value={detail.gameState} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#0c1015]/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-bright">VGK Point Scorers</p>
          <div className="mt-3 space-y-3">
            {detail.vgk.topPointScorers.length ? (
              detail.vgk.topPointScorers.map((player) => (
                <div key={player.name} className="flex items-center justify-between gap-4">
                  <PlayerNameButton playerId={player.playerId} onOpen={onOpenPlayer}>
                    {player.name}
                  </PlayerNameButton>
                  <p className="text-sm text-mist">{player.line}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-mist">No VGK point scorers available.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0c1015]/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-bright">VGK Goalies</p>
          <div className="mt-3 space-y-3">
            {detail.vgk.goalieSummary.length ? (
              detail.vgk.goalieSummary.map((goalie) => (
                <div key={goalie.name} className="flex items-center justify-between gap-4">
                  <div>
                    <PlayerNameButton playerId={goalie.playerId} onOpen={onOpenPlayer}>
                      {goalie.name}
                    </PlayerNameButton>
                    <p className="text-sm text-mist">{goalie.line}</p>
                  </div>
                  <p className="text-sm font-semibold text-gold-bright">{goalie.savePctg}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-mist">No goalie stats available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Team Stats</p>
          <div className="mt-3 space-y-2">
            {detail.teamStats.map((stat) => (
              <div key={stat.category} className="grid grid-cols-[0.7fr_1fr_0.7fr] items-center gap-3 text-sm">
                <span className="font-semibold text-white">{stat.awayValue}</span>
                <span className="text-center text-mist">{stat.label}</span>
                <span className="text-right font-semibold text-white">{stat.homeValue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Scoring By Period</p>
          <div className="mt-3 space-y-4">
            {detail.scoringByPeriod.map((period) => (
              <div key={period.period} className="rounded-xl border border-white/10 bg-[#0c1015]/70 p-3">
                <div className="grid grid-cols-[0.7fr_1fr_0.7fr] items-center gap-3 text-sm">
                  <span className="font-semibold text-white">{period.away}</span>
                  <span className="text-center text-mist">Period {period.period}</span>
                  <span className="text-right font-semibold text-white">{period.home}</span>
                </div>
                <div className="mt-3 space-y-3">
                  {period.goals.length ? (
                    period.goals.map((goal) => (
                      <div key={goal.eventId} className="flex gap-1.5 border-t border-white/10 pt-1.5">
                        <Image
                          src={logoSrc(goal.teamAbbrev)}
                          alt=""
                          width={18}
                          height={18}
                          className="h-5 w-5 shrink-0 object-contain"
                        />
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-gold-bright">
                            {goal.time} | {goal.teamAbbrev} | {goal.score}
                          </p>
                          <p className="text-[11px] leading-4 text-white">
                            <PlayerNameButton playerId={goal.scorerPlayerId} onOpen={onOpenPlayer}>
                              {goal.scorer}
                            </PlayerNameButton>{" "}
                            ({goal.scorerTotal})
                            {goal.assists.length ? (
                              <span className="text-mist">
                                {" "}
                                from{" "}
                                {goal.assists.map((assist, index) => (
                                  <span key={`${assist.playerId}-${assist.name}`}>
                                    {index > 0 ? ", " : ""}
                                    <PlayerNameButton playerId={assist.playerId} onOpen={onOpenPlayer}>
                                      {assist.name}
                                    </PlayerNameButton>{" "}
                                    ({assist.total})
                                  </span>
                                ))}
                              </span>
                            ) : (
                              <span className="text-mist"> unassisted</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="border-t border-white/10 pt-3 text-sm text-mist">No goals.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function VgkUpdatesDashboard({ data }: { data: VgkUpdatesData }) {
  const [currentData, setCurrentData] = useState(data);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(
    data.overview.featuredGame?.id ?? data.games[0]?.id ?? null
  );
  const [detail, setDetail] = useState<VgkGameDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [gameTypeFilter, setGameTypeFilter] = useState<"all" | "preseason" | "regular" | "playoffs">("all");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerCard, setPlayerCard] = useState<VgkPlayerCardData | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [goalPopup, setGoalPopup] = useState<GoalEvent | null>(null);
  const seenGoalIds = useRef<Set<number> | null>(null);
  const goalPopupTimer = useRef<number | null>(null);

  const filteredGames = useMemo(() => {
    if (gameTypeFilter === "preseason") return currentData.games.filter((game) => game.gameType === 1);
    if (gameTypeFilter === "regular") return currentData.games.filter((game) => game.gameType === 2);
    if (gameTypeFilter === "playoffs") return currentData.games.filter((game) => game.gameType === 3);
    return currentData.games;
  }, [currentData.games, gameTypeFilter]);
  const gameLogGames = currentData.overview.featuredGame?.isToday
    ? filteredGames.filter((game) => game.id !== currentData.overview.featuredGame?.id)
    : filteredGames;

  const selectedGame = useMemo(
    () => currentData.games.find((game) => game.id === selectedGameId) ?? null,
    [currentData.games, selectedGameId]
  );
  const selectedFeaturedGame = currentData.overview.featuredGame?.id === selectedGameId ? currentData.overview.featuredGame : null;
  const liveDetailScore = selectedFeaturedGame && detail?.id === selectedFeaturedGame.id ? detailScoreLine(detail) : null;
  const featuredGameStatus = selectedFeaturedGame && detail?.id === selectedFeaturedGame.id
    ? detail.gameState
    : currentData.overview.featuredGame?.status;

  useEffect(() => {
    let isCurrent = true;

    function refreshDashboardData() {
      fetch("/api/vgk-updates", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to refresh VGK updates.");
          }
          return response.json() as Promise<VgkUpdatesData>;
        })
        .then((updates) => {
          if (isCurrent) setCurrentData(updates);
        })
        .catch((error: Error) => {
          console.warn(error.message);
        });
    }

    refreshDashboardData();
    const refreshTimer = window.setInterval(refreshDashboardData, 30000);

    return () => {
      isCurrent = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    const featuredId = currentData.overview.featuredGame?.id ?? null;

    if (!featuredId || selectedGameId === featuredId) {
      return;
    }

    const selectedGameStillExists = currentData.games.some((game) => game.id === selectedGameId);

    if (!selectedGameStillExists) {
      setSelectedGameId(featuredId);
    }
  }, [currentData.games, currentData.overview.featuredGame?.id, selectedGameId]);

  useEffect(() => {
    if (!selectedGameId) return;

    let isCurrent = true;
    let refreshTimer: number | null = null;
    seenGoalIds.current = null;
    setGoalPopup(null);

    function loadGameDetail(showLoading: boolean) {
      if (showLoading) {
        setDetailLoading(true);
      }
      setDetailError(null);

      fetch(`/api/vgk-game/${selectedGameId}`, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to load game detail.");
          }
          return response.json() as Promise<VgkGameDetail>;
        })
        .then((gameDetail) => {
          if (isCurrent) {
            setDetail(gameDetail);

            const goals = gameDetail.scoringByPeriod.flatMap((period) => period.goals);
            const goalIds = new Set(goals.map((goal) => goal.eventId));

            if (!seenGoalIds.current || gameDetail.id !== selectedGameId) {
              seenGoalIds.current = goalIds;
              return;
            }

            const newGoals = goals.filter((goal) => !seenGoalIds.current?.has(goal.eventId));

            seenGoalIds.current = goalIds;

            if (newGoals.length) {
              const latestGoal = newGoals.at(-1) ?? null;
              setGoalPopup(latestGoal);

              if (goalPopupTimer.current) {
                window.clearTimeout(goalPopupTimer.current);
              }

              goalPopupTimer.current = window.setTimeout(() => {
                setGoalPopup(null);
                goalPopupTimer.current = null;
              }, 15000);
            }
          }
        })
        .catch((error: Error) => {
          if (isCurrent) {
            setDetail(null);
            setDetailError(error.message);
          }
        })
        .finally(() => {
          if (isCurrent && showLoading) setDetailLoading(false);
        });
    }

    loadGameDetail(true);
    refreshTimer = window.setInterval(() => loadGameDetail(false), 30000);

    return () => {
      isCurrent = false;
      if (refreshTimer) {
        window.clearInterval(refreshTimer);
      }
      if (goalPopupTimer.current) {
        window.clearTimeout(goalPopupTimer.current);
        goalPopupTimer.current = null;
      }
    };
  }, [selectedGameId]);

  useEffect(() => {
    if (!selectedPlayerId) return;

    let isCurrent = true;
    setPlayerLoading(true);
    setPlayerError(null);

    fetch(`/api/vgk-player/${selectedPlayerId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load player card.");
        }
        return response.json() as Promise<VgkPlayerCardData>;
      })
      .then((player) => {
        if (isCurrent) setPlayerCard(player);
      })
      .catch((error: Error) => {
        if (isCurrent) {
          setPlayerCard(null);
          setPlayerError(error.message);
        }
      })
      .finally(() => {
        if (isCurrent) setPlayerLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedPlayerId]);

  function closePlayerCard() {
    setSelectedPlayerId(null);
    setPlayerCard(null);
    setPlayerError(null);
  }

  return (
    <>
      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="eyebrow">VGK Updates</p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white md:text-6xl">
              Golden Knights Live Dashboard
            </h1>
            <p className="mt-4 max-w-4xl whitespace-nowrap text-xs leading-7 text-mist md:text-sm lg:text-base">
              1x Stanley Cup Champion, 2x Western Conference Champions, 5x Pacific Division Champions
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:ml-6">
            <StatTile label="Record" value={currentData.overview.teamSnapshot?.record ?? "N/A"} />
            <StatTile label="Points" value={currentData.overview.teamSnapshot?.points ?? "N/A"} />
            <StatTile label="Division" value={currentData.overview.teamSnapshot?.standingsPosition ?? "N/A"} />
            <StatTile
              label={currentData.overview.featuredGame?.label ?? "Latest Game"}
              value={liveDetailScore ?? currentData.overview.featuredGame?.score ?? currentData.overview.latestGame.score}
            />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <LeaderBox
          eyebrow="Regular Season Leaders"
          gamesPlayed={currentData.leaderGroups.regularSeason.gamesPlayed}
          leaders={currentData.leaderGroups.regularSeason.leaders}
          onOpenPlayer={setSelectedPlayerId}
        />
        <LeaderBox
          eyebrow="Playoff Leaders"
          gamesPlayed={currentData.leaderGroups.playoffs.gamesPlayed}
          leaders={currentData.leaderGroups.playoffs.leaders}
          onOpenPlayer={setSelectedPlayerId}
        />
      </div>

      <div id="live-game" className="mt-6 scroll-mt-28">
        <GameDetailPanel
          detail={detail}
          error={detailError}
          goalPopup={goalPopup}
          loading={detailLoading}
          onCloseGoalPopup={() => setGoalPopup(null)}
          onOpenPlayer={setSelectedPlayerId}
        />
      </div>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Games Played</p>
            <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
                Vegas Game Log
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "All"],
                  ["regular", "Regular Season"],
                  ["playoffs", "Playoffs"],
                  ["preseason", "Preseason"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGameTypeFilter(value as typeof gameTypeFilter)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      gameTypeFilter === value
                        ? "border-gold/60 bg-gold/15 text-white"
                        : "border-white/10 bg-white/[0.03] text-mist hover:border-gold/40 hover:text-white"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {selectedFeaturedGame ? (
            <p className="text-sm text-mist">
              Selected: {formatDate(selectedFeaturedGame.date)} vs {selectedFeaturedGame.opponentAbbrev}
            </p>
          ) : selectedGame ? (
            <p className="text-sm text-mist">
              Selected: {formatDate(selectedGame.date)} vs {selectedGame.opponent}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {currentData.overview.featuredGame?.isToday ? (
            <button
              type="button"
              onClick={() => setSelectedGameId(currentData.overview.featuredGame?.id ?? null)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                "border-gold/35 bg-gold/10 hover:border-gold/60 hover:bg-gold/15",
                currentData.overview.featuredGame.id === selectedGameId && "border-gold/70 bg-gold/20"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={logoSrc(currentData.overview.featuredGame.opponentAbbrev)}
                    alt=""
                    width={38}
                    height={38}
                    className="h-10 w-10 object-contain"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-bright">
                      {currentData.overview.featuredGame.label}
                    </p>
                    <p className="font-bold text-white">{currentData.overview.featuredGame.opponentAbbrev}</p>
                  </div>
                </div>
                <span className={cn("text-xs font-bold uppercase tracking-[0.16em]", currentData.overview.featuredGame.isLive ? "text-red-300" : "text-gold-bright")}>
                  {featuredGameStatus}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-mist">
                    {formatDate(currentData.overview.featuredGame.date, {
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit"
                    })}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-mist">
                    {currentData.overview.featuredGame.homeAway}
                  </p>
                </div>
                <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                  {liveDetailScore ?? currentData.overview.featuredGame.score}
                </p>
              </div>
            </button>
          ) : null}

          {gameLogGames.map((game) => {
            const isSelected = game.id === selectedGameId;

            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedGameId(game.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  "border-white/10 bg-white/[0.03] hover:border-gold/40 hover:bg-gold/10",
                  isSelected && "border-gold/60 bg-gold/15"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image src={logoSrc(game.opponent)} alt="" width={38} height={38} className="h-10 w-10 object-contain" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                        {game.homeAway}
                      </p>
                      <p className="font-bold text-white">{game.opponent}</p>
                    </div>
                  </div>
                  <span className={game.result === "W" ? "text-lg font-bold text-gold-bright" : "text-lg font-bold text-red-300"}>
                    {game.result}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-mist">{formatDate(game.date, { month: "numeric", day: "numeric" })}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-mist">
                      {game.gameTypeLabel}
                    </p>
                  </div>
                  <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                    {game.score}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selectedPlayerId ? (
        <PlayerCardDrawer
          error={playerError}
          loading={playerLoading}
          onClose={closePlayerCard}
          player={playerCard}
        />
      ) : null}
    </>
  );
}
