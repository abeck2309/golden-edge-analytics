const NHL_WEB_BASE_URL = "https://api-web.nhle.com/v1";
const ODDS_API_BASE_URL = "https://api.the-odds-api.com/v4";
const VGK_ABBREV = "VGK";

type LocalizedString = {
  default?: string;
};

type TeamInGame = {
  id: number;
  abbrev: string;
  score?: number;
  sog?: number;
  logo?: string;
  commonName?: LocalizedString;
  placeName?: LocalizedString;
};

type ScheduleGame = {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  startTimeUTC?: string;
  gameState: string;
  gameScheduleState?: string;
  awayTeam: TeamInGame;
  homeTeam: TeamInGame;
  gameOutcome?: {
    lastPeriodType?: string;
  };
  periodDescriptor?: {
    periodType: string;
  };
  seriesStatus?: {
    bottomSeedWins: number;
    gameNumberOfSeries: number;
    neededToWin: number;
    topSeedWins: number;
  };
};

type ScheduleResponse = {
  clubTimezone?: string;
  games: ScheduleGame[];
};

type BettingOddsOutcome = {
  name: string;
  price: number;
  point?: number;
};

type BettingOddsMarket = {
  key: "h2h" | "spreads" | "totals";
  last_update?: string;
  outcomes: BettingOddsOutcome[];
};

type BettingOddsBookmaker = {
  key: string;
  title: string;
  last_update?: string;
  markets: BettingOddsMarket[];
};

type BettingOddsEvent = {
  id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: BettingOddsBookmaker[];
};

type StandingsTeam = {
  conferenceName?: string;
  conferenceSequence?: number;
  divisionName?: string;
  divisionSequence?: number;
  gamesPlayed?: number;
  losses: number;
  otLosses: number;
  points: number;
  teamAbbrev: LocalizedString;
  teamName: LocalizedString;
  wins: number;
};

type StandingsResponse = {
  standings: StandingsTeam[];
};

type RosterResponse = {
  forwards?: unknown[];
  defensemen?: unknown[];
  goalies?: unknown[];
};

type GameSkater = {
  playerId: number;
  name: LocalizedString;
  position: string;
  goals: number;
  assists: number;
  points: number;
  sog?: number;
  hits?: number;
  blockedShots?: number;
  toi?: string;
};

type GameGoalie = {
  playerId: number;
  name: LocalizedString;
  decision?: string;
  goalsAgainst: number;
  savePctg?: number;
  saves: number;
  shotsAgainst: number;
  toi: string;
};

type TeamGamePlayers = {
  forwards?: GameSkater[];
  defense?: GameSkater[];
  goalies?: GameGoalie[];
};

type GameBoxscore = {
  id: number;
  gameDate: string;
  startTimeUTC?: string;
  gameState: string;
  awayTeam: TeamInGame;
  homeTeam: TeamInGame;
  playerByGameStats?: {
    awayTeam?: TeamGamePlayers;
    homeTeam?: TeamGamePlayers;
  };
  gameOutcome?: {
    lastPeriodType?: string;
    otPeriods?: number;
  };
};

type GameRightRail = {
  linescore?: {
    byPeriod?: {
      periodDescriptor: {
        number: number;
        periodType: string;
      };
      away: number;
      home: number;
    }[];
  };
  teamGameStats?: {
    category: string;
    awayValue: string | number;
    homeValue: string | number;
  }[];
};

type RosterSpot = {
  teamId: number;
  playerId: number;
  firstName: LocalizedString;
  lastName: LocalizedString;
};

type GoalPlay = {
  eventId: number;
  periodDescriptor: {
    number: number;
    periodType: string;
  };
  timeInPeriod: string;
  timeRemaining?: string;
  typeDescKey: string;
  details?: {
    xCoord?: number;
    yCoord?: number;
    zoneCode?: string;
    shotType?: string;
    scoringPlayerId?: number;
    scoringPlayerTotal?: number;
    assist1PlayerId?: number;
    assist1PlayerTotal?: number;
    assist2PlayerId?: number;
    assist2PlayerTotal?: number;
    eventOwnerTeamId?: number;
    goalieInNetId?: number;
    awayScore?: number;
    homeScore?: number;
    highlightClipSharingUrl?: string;
  };
};

type GamePlayByPlay = {
  plays?: GoalPlay[];
  rosterSpots?: RosterSpot[];
};

type ClubStatsSkater = {
  playerId: number;
  firstName: LocalizedString;
  lastName: LocalizedString;
  positionCode: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
};

type ClubStatsResponse = {
  season: string;
  gameType: number;
  skaters: ClubStatsSkater[];
};

type PlayoffBracketTeam = {
  id: number;
  abbrev: string;
  name?: LocalizedString;
  commonName?: LocalizedString;
  logo?: string;
  darkLogo?: string;
};

type PlayoffBracketSeries = {
  seriesTitle?: string;
  seriesAbbrev?: string;
  seriesLetter?: string;
  playoffRound?: number;
  topSeedRankAbbrev?: string;
  topSeedWins?: number;
  bottomSeedRankAbbrev?: string;
  bottomSeedWins?: number;
  winningTeamId?: number;
  topSeedTeam?: PlayoffBracketTeam;
  bottomSeedTeam?: PlayoffBracketTeam;
};

type PlayoffBracketResponse = {
  bracketLogo?: string;
  series?: PlayoffBracketSeries[];
};

type Leader = {
  label: string;
  name: string;
  playerId?: number;
  value: number;
};

type PlayerLandingStats = {
  gamesPlayed?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  shots?: number;
  pim?: number;
  avgToi?: string;
  wins?: number;
  losses?: number;
  otLosses?: number;
  goalsAgainstAvg?: number;
  savePctg?: number;
  shutouts?: number;
};

type PlayerLanding = {
  playerId: number;
  firstName: LocalizedString;
  lastName: LocalizedString;
  currentTeamAbbrev?: string;
  fullTeamName?: LocalizedString;
  sweaterNumber?: number;
  position?: string;
  headshot?: string;
  heroImage?: string;
  heightInInches?: number;
  weightInPounds?: number;
  birthDate?: string;
  birthCity?: LocalizedString;
  birthStateProvince?: LocalizedString;
  birthCountry?: string;
  shootsCatches?: string;
  featuredStats?: {
    season?: number;
    regularSeason?: {
      subSeason?: PlayerLandingStats;
      career?: PlayerLandingStats;
    };
    playoffs?: {
      subSeason?: PlayerLandingStats;
      career?: PlayerLandingStats;
    };
  };
  last5Games?: {
    decision?: string;
    gameId: number;
    gameDate: string;
    opponentAbbrev: string;
    goals: number;
    assists: number;
    points: number;
    goalsAgainst?: number;
    savePctg?: number;
    shotsAgainst?: number;
    shots?: number;
    toi?: string;
  }[];
  seasonTotals?: {
    season: number;
    gameTypeId: number;
    leagueAbbrev?: string;
    teamName?: LocalizedString;
    gamesPlayed?: number;
    goals?: number;
    assists?: number;
    points?: number;
    plusMinus?: number;
    pim?: number;
    shots?: number;
    avgToi?: string;
    wins?: number;
    losses?: number;
    otLosses?: number;
    goalsAgainstAvg?: number;
    savePctg?: number;
    shutouts?: number;
    gamesStarted?: number;
    shotsAgainst?: number;
    goalsAgainst?: number;
  }[];
};

export const nhlEndpoints = {
  schedule: `${NHL_WEB_BASE_URL}/club-schedule-season/${VGK_ABBREV}/now`,
  standings: `${NHL_WEB_BASE_URL}/standings/now`,
  roster: `${NHL_WEB_BASE_URL}/roster/${VGK_ABBREV}/current`,
  boxscore: (gameId: number) => `${NHL_WEB_BASE_URL}/gamecenter/${gameId}/boxscore`,
  gameRightRail: (gameId: number) => `${NHL_WEB_BASE_URL}/gamecenter/${gameId}/right-rail`,
  playByPlay: (gameId: number) => `${NHL_WEB_BASE_URL}/gamecenter/${gameId}/play-by-play`,
  playerLanding: (playerId: number) => `${NHL_WEB_BASE_URL}/player/${playerId}/landing`,
  playoffBracket: (year: number) => `${NHL_WEB_BASE_URL}/playoff-bracket/${year}`,
  clubStats: (season: number, gameType: 2 | 3) => `${NHL_WEB_BASE_URL}/club-stats/${VGK_ABBREV}/${season}/${gameType}`
};

type ApiCacheEntry<T> = {
  data: T;
  expiresAt: number;
  staleUntil: number;
};

const nhlResponseCache = new Map<string, ApiCacheEntry<unknown>>();
const nhlInflightRequests = new Map<string, Promise<unknown>>();

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nhlCacheTtlMs(url: string) {
  if (url.includes("/gamecenter/")) return 12_000;
  if (url.includes("/standings/")) return 60_000;
  if (url.includes("/roster/") || url.includes("/club-stats/") || url.includes("/playoff-bracket/")) return 300_000;

  return 30_000;
}

async function fetchNhlJson<T>(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json"
    }
  });

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("retry-after"));
    await wait(Number.isFinite(retryAfter) ? Math.min(retryAfter * 1000, 2_000) : 1_000);

    const retryResponse = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    });

    if (!retryResponse.ok) {
      throw new Error(`NHL API request failed (${retryResponse.status}) for ${url}`);
    }

    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    throw new Error(`NHL API request failed (${response.status}) for ${url}`);
  }

  return response.json() as Promise<T>;
}

async function nhlApiFetch<T>(url: string): Promise<T> {
  const now = Date.now();
  const cached = nhlResponseCache.get(url) as ApiCacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const inflight = nhlInflightRequests.get(url) as Promise<T> | undefined;

  if (inflight) {
    return inflight;
  }

  const ttl = nhlCacheTtlMs(url);
  const request = fetchNhlJson<T>(url)
    .then((data) => {
      nhlResponseCache.set(url, {
        data,
        expiresAt: Date.now() + ttl,
        staleUntil: Date.now() + 15 * 60_000
      });

      return data;
    })
    .catch((error) => {
      if (cached && cached.staleUntil > Date.now()) {
        return cached.data;
      }

      throw error;
    })
    .finally(() => {
      nhlInflightRequests.delete(url);
    });

  nhlInflightRequests.set(url, request);

  return request;
}

async function oddsApiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Odds API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function nameFromParts(firstName?: LocalizedString, lastName?: LocalizedString) {
  return [firstName?.default, lastName?.default].filter(Boolean).join(" ");
}

function displayTeamName(team: TeamInGame) {
  return [team.placeName?.default, team.commonName?.default].filter(Boolean).join(" ");
}

function normalizeTeamName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function formatAmericanOdds(value?: number) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return value > 0 ? `+${value}` : `${value}`;
}

function formatPoint(value?: number) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function marketByKey(bookmaker: BettingOddsBookmaker, key: BettingOddsMarket["key"]) {
  return bookmaker.markets.find((market) => market.key === key);
}

function outcomeForTeam(market: BettingOddsMarket | undefined, teamName: string) {
  const normalizedName = normalizeTeamName(teamName);

  return market?.outcomes.find((outcome) => normalizeTeamName(outcome.name) === normalizedName);
}

function matchupMatchesOddsEvent(event: BettingOddsEvent, game: ScheduleGame) {
  const gameHome = normalizeTeamName(displayTeamName(game.homeTeam));
  const gameAway = normalizeTeamName(displayTeamName(game.awayTeam));

  return normalizeTeamName(event.home_team) === gameHome && normalizeTeamName(event.away_team) === gameAway;
}

function dateMatchesOddsEvent(event: BettingOddsEvent, game: ScheduleGame) {
  const gameTime = new Date(game.startTimeUTC ?? game.gameDate).getTime();
  const oddsTime = new Date(event.commence_time).getTime();

  if (Number.isNaN(gameTime) || Number.isNaN(oddsTime)) {
    return true;
  }

  return Math.abs(gameTime - oddsTime) <= 1000 * 60 * 60 * 12;
}

async function getVgkBettingOdds(game?: ScheduleGame | null) {
  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey || !game) {
    return null;
  }

  const url = new URL(`${ODDS_API_BASE_URL}/sports/icehockey_nhl/odds`);
  url.searchParams.set("regions", "us");
  url.searchParams.set("markets", "h2h,spreads,totals");
  url.searchParams.set("bookmakers", "fanduel");
  url.searchParams.set("oddsFormat", "american");
  url.searchParams.set("apiKey", apiKey);

  try {
    const events = await oddsApiFetch<BettingOddsEvent[]>(url.toString());
    const event = events.find((candidate) => matchupMatchesOddsEvent(candidate, game) && dateMatchesOddsEvent(candidate, game));
    const bookmaker = event?.bookmakers?.find((book) => book.key === "fanduel") ?? event?.bookmakers?.[0];

    if (!event || !bookmaker) {
      return null;
    }

    const h2h = marketByKey(bookmaker, "h2h");
    const spreads = marketByKey(bookmaker, "spreads");
    const totals = marketByKey(bookmaker, "totals");
    const vgkName = displayTeamName(game.awayTeam.abbrev === VGK_ABBREV ? game.awayTeam : game.homeTeam);
    const opponentName = displayTeamName(getOpponent(game));
    const vgkMoneyline = outcomeForTeam(h2h, vgkName);
    const opponentMoneyline = outcomeForTeam(h2h, opponentName);
    const vgkSpread = outcomeForTeam(spreads, vgkName);
    const over = totals?.outcomes.find((outcome) => outcome.name.toLowerCase() === "over");
    const under = totals?.outcomes.find((outcome) => outcome.name.toLowerCase() === "under");
    const lastUpdated = bookmaker.last_update ?? h2h?.last_update ?? spreads?.last_update ?? totals?.last_update ?? null;

    return {
      provider: bookmaker.title,
      label: bookmaker.title === "FanDuel" ? "FanDuel Odds" : `${bookmaker.title} Odds`,
      value: `${VGK_ABBREV} ${formatAmericanOdds(vgkMoneyline?.price)} | ${getOpponent(game).abbrev} ${formatAmericanOdds(opponentMoneyline?.price)}`,
      moneyline: {
        vgk: formatAmericanOdds(vgkMoneyline?.price),
        opponent: formatAmericanOdds(opponentMoneyline?.price)
      },
      spread: vgkSpread
        ? `${VGK_ABBREV} ${formatPoint(vgkSpread.point)} (${formatAmericanOdds(vgkSpread.price)})`
        : null,
      total: over
        ? `O/U ${formatPoint(over.point)} (${formatAmericanOdds(over.price)}/${formatAmericanOdds(under?.price)})`
        : null,
      lastUpdated
    };
  } catch {
    return null;
  }
}

function displayBracketTeamName(team?: PlayoffBracketTeam) {
  return team?.commonName?.default ?? team?.name?.default ?? team?.abbrev ?? "TBD";
}

function ordinal(value?: number) {
  if (!value) return "N/A";
  const suffix =
    value % 10 === 1 && value % 100 !== 11
      ? "st"
      : value % 10 === 2 && value % 100 !== 12
        ? "nd"
        : value % 10 === 3 && value % 100 !== 13
          ? "rd"
          : "th";

  return `${value}${suffix}`;
}

function isCompletedGame(game: ScheduleGame) {
  return (
    ["FINAL", "OFF"].includes(game.gameState) &&
    typeof game.awayTeam.score === "number" &&
    typeof game.homeTeam.score === "number"
  );
}

function isFutureGame(game: ScheduleGame) {
  return ["FUT", "PRE"].includes(game.gameState);
}

function isLiveGame(game: ScheduleGame) {
  return ["LIVE", "CRIT"].includes(game.gameState);
}

function pacificDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function getGameTypeLabel(gameType: number) {
  if (gameType === 1) return "Preseason";
  if (gameType === 3) return "Playoffs";
  return "Regular Season";
}

function getVgkSide(game: Pick<ScheduleGame, "awayTeam" | "homeTeam">) {
  return game.awayTeam.abbrev === VGK_ABBREV ? "away" : "home";
}

function getOpponent(game: Pick<ScheduleGame, "awayTeam" | "homeTeam">) {
  return game.awayTeam.abbrev === VGK_ABBREV ? game.homeTeam : game.awayTeam;
}

function scoreFor(game: Pick<ScheduleGame, "awayTeam" | "homeTeam">, side: "away" | "home") {
  return side === "away" ? game.awayTeam.score ?? 0 : game.homeTeam.score ?? 0;
}

function gameResult(game: ScheduleGame) {
  const side = getVgkSide(game);
  const vgkScore = scoreFor(game, side);
  const opponentScore = scoreFor(game, side === "away" ? "home" : "away");
  return vgkScore > opponentScore ? "W" : "L";
}

function scoreLine(game: ScheduleGame) {
  const side = getVgkSide(game);
  const opponent = getOpponent(game);
  const otherSide = side === "away" ? "home" : "away";

  if (typeof game.awayTeam.score === "number" && typeof game.homeTeam.score === "number") {
    return `${VGK_ABBREV} ${scoreFor(game, side)}, ${opponent.abbrev} ${scoreFor(game, otherSide)}`;
  }

  return side === "away" ? `${VGK_ABBREV} @ ${opponent.abbrev}` : `${opponent.abbrev} @ ${VGK_ABBREV}`;
}

function featuredGameLabel(game: ScheduleGame, isToday: boolean) {
  if (isLiveGame(game)) return "Live Game";
  if (isToday && isFutureGame(game)) return "Today's Game";
  if (isCompletedGame(game)) return "Latest Game";
  return "Next Game";
}

function collectSkaters(players?: TeamGamePlayers) {
  return [...(players?.forwards ?? []), ...(players?.defense ?? [])];
}

function makeLeader(skaters: ClubStatsSkater[], label: string, stat: "goals" | "assists" | "points"): Leader {
  const leader = [...skaters].sort((a, b) => b[stat] - a[stat] || b.points - a.points)[0];

  return {
    label,
    name: leader ? nameFromParts(leader.firstName, leader.lastName) : "N/A",
    playerId: leader?.playerId,
    value: leader?.[stat] ?? 0
  };
}

function makeLeaders(clubStats: ClubStatsResponse) {
  return {
    gameType: clubStats.gameType,
    gamesPlayed: Math.max(...clubStats.skaters.map((player) => player.gamesPlayed), 0),
    leaders: [
      makeLeader(clubStats.skaters, "Goals", "goals"),
      makeLeader(clubStats.skaters, "Assists", "assists"),
      makeLeader(clubStats.skaters, "Points", "points")
    ]
  };
}

function playoffYearFromSeason(season: number) {
  const seasonText = String(season);
  const endYear = Number(seasonText.slice(4));
  return Number.isFinite(endYear) ? endYear : new Date().getFullYear();
}

function seriesLeaderText(series: PlayoffBracketSeries) {
  const topWins = series.topSeedWins ?? 0;
  const bottomWins = series.bottomSeedWins ?? 0;
  const winningTeamId = playoffSeriesWinnerId(series);

  if (winningTeamId) {
    const winner =
      winningTeamId === series.topSeedTeam?.id
        ? series.topSeedTeam
        : winningTeamId === series.bottomSeedTeam?.id
          ? series.bottomSeedTeam
          : undefined;

    return `${displayBracketTeamName(winner)} won ${Math.max(topWins, bottomWins)}-${Math.min(topWins, bottomWins)}`;
  }

  if (topWins === bottomWins) {
    return `Series tied ${topWins}-${bottomWins}`;
  }

  const leader = topWins > bottomWins ? series.topSeedTeam : series.bottomSeedTeam;
  return `${displayBracketTeamName(leader)} leads ${Math.max(topWins, bottomWins)}-${Math.min(topWins, bottomWins)}`;
}

function playoffSeriesWinnerId(series: PlayoffBracketSeries) {
  if (series.winningTeamId) {
    return series.winningTeamId;
  }

  const topWins = series.topSeedWins ?? 0;
  const bottomWins = series.bottomSeedWins ?? 0;

  if (topWins >= 4 && topWins > bottomWins) {
    return series.topSeedTeam?.id;
  }

  if (bottomWins >= 4 && bottomWins > topWins) {
    return series.bottomSeedTeam?.id;
  }

  return undefined;
}

function playoffDivisionSeed(seriesLetter = "", seed = "") {
  const divisionBySeries: Record<string, "A" | "M" | "C" | "P"> = {
    A: "A",
    B: "A",
    C: "M",
    D: "M",
    E: "C",
    F: "C",
    G: "P",
    H: "P",
    I: "A",
    J: "M",
    K: "C",
    L: "P"
  };
  const division = divisionBySeries[seriesLetter];

  if (!division || !seed.startsWith("D")) {
    return seed;
  }

  return `${division}${seed.slice(1)}`;
}

async function getPlayoffBracketForSeason(season: number) {
  const year = playoffYearFromSeason(season);

  try {
    const bracket = await nhlApiFetch<PlayoffBracketResponse>(nhlEndpoints.playoffBracket(year));
    const series = (bracket.series ?? [])
      .map((matchup) => {
        const winnerId = playoffSeriesWinnerId(matchup);

        return {
          seriesLetter: matchup.seriesLetter ?? "",
          round: matchup.playoffRound ?? 0,
          roundLabel: matchup.seriesTitle ?? matchup.seriesAbbrev ?? "Playoffs",
          seriesAbbrev: matchup.seriesAbbrev ?? "",
          status: seriesLeaderText(matchup),
          topSeed: {
            abbrev: matchup.topSeedTeam?.abbrev ?? "TBD",
            id: matchup.topSeedTeam?.id,
            logo: matchup.topSeedTeam?.darkLogo ?? matchup.topSeedTeam?.logo,
            name: displayBracketTeamName(matchup.topSeedTeam),
            seed: playoffDivisionSeed(matchup.seriesLetter, matchup.topSeedRankAbbrev),
            wins: matchup.topSeedWins ?? 0,
            isWinner: winnerId === matchup.topSeedTeam?.id
          },
          bottomSeed: {
            abbrev: matchup.bottomSeedTeam?.abbrev ?? "TBD",
            id: matchup.bottomSeedTeam?.id,
            logo: matchup.bottomSeedTeam?.darkLogo ?? matchup.bottomSeedTeam?.logo,
            name: displayBracketTeamName(matchup.bottomSeedTeam),
            seed: playoffDivisionSeed(matchup.seriesLetter, matchup.bottomSeedRankAbbrev),
            wins: matchup.bottomSeedWins ?? 0,
            isWinner: winnerId === matchup.bottomSeedTeam?.id
          }
        };
      });

    return {
      logo: bracket.bracketLogo,
      series,
      year
    };
  } catch {
    return {
      logo: undefined,
      series: [],
      year
    };
  }
}

function teamStatsFor(rightRail: GameRightRail, game: GameBoxscore) {
  function formatTeamStatLabel(category: string) {
    return category
      .replace(/^sog$/i, "SOG")
      .replace(/^pim$/i, "PIM")
      .replace(/Pctg$/, " %")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (letter) => letter.toUpperCase());
  }

  function formatTeamStatValue(value: string | number) {
    if (typeof value === "number") {
      return Number.isInteger(value) ? value : value.toFixed(2);
    }

    return value.replace(/-?\d+\.\d+/g, (match) => Number(match).toFixed(2));
  }

  return (rightRail.teamGameStats ?? []).map((stat) => ({
    category: stat.category,
    label: formatTeamStatLabel(stat.category),
    awayValue: formatTeamStatValue(stat.awayValue),
    homeValue: formatTeamStatValue(stat.homeValue)
  }));
}

function topPointScorers(players?: TeamGamePlayers, limit = 4) {
  return collectSkaters(players)
    .filter((player) => player.points > 0)
    .sort((a, b) => b.points - a.points || b.goals - a.goals || (b.sog ?? 0) - (a.sog ?? 0))
    .slice(0, limit)
    .map((player) => ({
      playerId: player.playerId,
      name: player.name.default ?? "Unknown",
      line: `${player.goals}G ${player.assists}A, ${player.points} PTS`
    }));
}

function goalieSummary(players?: TeamGamePlayers) {
  return (players?.goalies ?? [])
    .filter((goalie) => goalie.shotsAgainst > 0 || goalie.toi !== "00:00")
    .map((goalie) => ({
      playerId: goalie.playerId,
      name: goalie.name.default ?? "Unknown",
      line: `${goalie.saves}/${goalie.shotsAgainst} saves${goalie.decision ? `, ${goalie.decision}` : ""}`,
      savePctg: typeof goalie.savePctg === "number" ? goalie.savePctg.toFixed(3).replace(/^0/, "") : "N/A"
    }));
}

function nextCareerMilestoneTarget(value: number) {
  const step = value >= 100 ? 100 : 50;
  return Math.ceil((value + 1) / step) * step;
}

async function careerMilestonesForTeam(players?: TeamGamePlayers) {
  const skaters = collectSkaters(players).slice(0, 22);
  const playerResults = await Promise.allSettled(
    skaters.map(async (player) => {
      const landing = await nhlApiFetch<PlayerLanding>(nhlEndpoints.playerLanding(player.playerId));
      const career = landing.featuredStats?.regularSeason?.career;
      const candidates = [
        { label: "Career Goals", value: career?.goals ?? 0 },
        { label: "Career Assists", value: career?.assists ?? 0 },
        { label: "Career Points", value: career?.points ?? 0 }
      ]
        .filter((candidate) => candidate.value > 0)
        .map((candidate) => {
          const target = nextCareerMilestoneTarget(candidate.value);
          return {
            ...candidate,
            target,
            remaining: target - candidate.value
          };
        })
        .sort((a, b) => a.remaining - b.remaining || b.value - a.value);

      const closest = candidates[0];
      if (!closest) return null;

      return {
        playerId: player.playerId,
        name: player.name.default ?? nameFromParts(landing.firstName, landing.lastName),
        ...closest
      };
    })
  );

  return playerResults
    .flatMap((result) => (result.status === "fulfilled" && result.value ? [result.value] : []))
    .sort((a, b) => a.remaining - b.remaining || b.value - a.value)
    .slice(0, 3);
}

function periodKey(period: { number: number; periodType: string }) {
  return period.periodType === "REG" ? String(period.number) : `${period.periodType}-${period.number}`;
}

function overtimePeriodLabel(period: { number: number; periodType: string }) {
  if (period.periodType !== "OT") {
    return period.periodType;
  }

  const overtimeNumber = Math.max(period.number - 3, 1);
  return overtimeNumber === 1 ? "OT" : `${overtimeNumber}OT`;
}

function periodScoreLabel(period: { number: number; periodType: string }) {
  return period.periodType === "REG" ? String(period.number) : overtimePeriodLabel(period);
}

function ordinalPeriod(period: { number: number; periodType: string }) {
  if (period.periodType !== "REG") {
    return overtimePeriodLabel(period);
  }

  if (period.number === 1) return "1st period";
  if (period.number === 2) return "2nd period";
  if (period.number === 3) return "3rd period";
  return `${period.number}th period`;
}

function playerName(playerId: number | undefined, rosterById: Map<number, RosterSpot>) {
  if (!playerId) return "Unknown";
  const player = rosterById.get(playerId);
  return player ? nameFromParts(player.firstName, player.lastName) : "Unknown";
}

function scoringBreakdown(playByPlay: GamePlayByPlay, boxscore: GameBoxscore) {
  const rosterById = new Map((playByPlay.rosterSpots ?? []).map((spot) => [spot.playerId, spot]));
  const teamById = new Map([
    [boxscore.awayTeam.id, boxscore.awayTeam],
    [boxscore.homeTeam.id, boxscore.homeTeam]
  ]);

  return (playByPlay.plays ?? [])
    .filter((play) => play.typeDescKey === "goal")
    .map((play) => {
      const scoringTeam = play.details?.eventOwnerTeamId
        ? teamById.get(play.details.eventOwnerTeamId)
        : undefined;
      const assists = [
        play.details?.assist1PlayerId
          ? {
              name: playerName(play.details.assist1PlayerId, rosterById),
              total: play.details.assist1PlayerTotal ?? 0
            }
          : null,
        play.details?.assist2PlayerId
          ? {
              name: playerName(play.details.assist2PlayerId, rosterById),
              total: play.details.assist2PlayerTotal ?? 0
            }
          : null
      ].filter((assist): assist is { name: string; total: number } => Boolean(assist));

      return {
        eventId: play.eventId,
        period: periodKey(play.periodDescriptor),
        periodLabel: ordinalPeriod(play.periodDescriptor),
        time: play.timeInPeriod,
        timeRemaining: play.timeRemaining ?? "00:00",
        teamAbbrev: scoringTeam?.abbrev ?? "NHL",
        scorerPlayerId: play.details?.scoringPlayerId,
        scorer: playerName(play.details?.scoringPlayerId, rosterById),
        scorerTotal: play.details?.scoringPlayerTotal ?? 0,
        shotType: play.details?.shotType,
        zoneCode: play.details?.zoneCode,
        xCoord: play.details?.xCoord,
        yCoord: play.details?.yCoord,
        goaliePlayerId: play.details?.goalieInNetId,
        goalieName: playerName(play.details?.goalieInNetId, rosterById),
        highlightUrl: play.details?.highlightClipSharingUrl,
        assists: assists.map((assist, index) => ({
          ...assist,
          playerId: index === 0 ? play.details?.assist1PlayerId : play.details?.assist2PlayerId
        })),
        score: `${play.details?.awayScore ?? 0}-${play.details?.homeScore ?? 0}`,
        awayScore: play.details?.awayScore ?? 0,
        homeScore: play.details?.homeScore ?? 0
      };
    });
}

function formatHeight(inches?: number) {
  if (!inches) return "N/A";
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

function displayPosition(position?: string) {
  if (position === "L") return "LW";
  if (position === "R") return "RW";
  return position ?? "N/A";
}

function calculateAge(birthDate?: string) {
  if (!birthDate) return "N/A";
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const today = new Date();
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const hasHadBirthday =
    today.getUTCMonth() > birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() >= birth.getUTCDate());

  if (!hasHadBirthday) age -= 1;
  return age;
}

function normalizeStats(stats?: PlayerLandingStats) {
  return {
    gamesPlayed: stats?.gamesPlayed ?? 0,
    goals: stats?.goals ?? 0,
    assists: stats?.assists ?? 0,
    points: stats?.points ?? 0,
    plusMinus: stats?.plusMinus ?? 0,
    shots: stats?.shots ?? 0,
    pim: stats?.pim ?? 0,
    avgToi: stats?.avgToi ?? "N/A",
    wins: stats?.wins ?? 0,
    losses: stats?.losses ?? 0,
    otLosses: stats?.otLosses ?? 0,
    goalsAgainstAvg: typeof stats?.goalsAgainstAvg === "number" ? stats.goalsAgainstAvg.toFixed(2) : "0.00",
    savePctg: typeof stats?.savePctg === "number" ? stats.savePctg.toFixed(3).replace(/^0/, "") : ".000",
    shutouts: stats?.shutouts ?? 0
  };
}

export async function getVgkPlayerCard(playerId: number) {
  const player = await nhlApiFetch<PlayerLanding>(nhlEndpoints.playerLanding(playerId));

  return {
    playerId: player.playerId,
    name: nameFromParts(player.firstName, player.lastName),
    team: player.fullTeamName?.default ?? player.currentTeamAbbrev ?? "N/A",
    teamAbbrev: player.currentTeamAbbrev ?? "N/A",
    sweaterNumber: player.sweaterNumber,
    position: displayPosition(player.position),
    isGoalie: player.position === "G",
    headshot: player.headshot,
    heroImage: player.heroImage,
    age: calculateAge(player.birthDate),
    height: formatHeight(player.heightInInches),
    weight: player.weightInPounds ? `${player.weightInPounds} lb` : "N/A",
    shootsCatches: player.shootsCatches ?? "N/A",
    birthPlace: [player.birthCity?.default, player.birthStateProvince?.default, player.birthCountry]
      .filter(Boolean)
      .join(", "),
    season: player.featuredStats?.season,
    regularSeason: normalizeStats(player.featuredStats?.regularSeason?.subSeason),
    playoffs: normalizeStats(player.featuredStats?.playoffs?.subSeason),
    careerRegularSeason: normalizeStats(player.featuredStats?.regularSeason?.career),
    careerBySeason: (player.seasonTotals ?? [])
      .filter((season) => season.leagueAbbrev === "NHL")
      .map((season) => ({
        season: `${String(season.season).slice(0, 4)}-${String(season.season).slice(4)}`,
        gameType: season.gameTypeId === 3 ? "Playoffs" : "Regular Season",
        team: season.teamName?.default ?? "N/A",
        gamesPlayed: season.gamesPlayed ?? 0,
        goals: season.goals ?? 0,
        assists: season.assists ?? 0,
        points: season.points ?? 0,
        plusMinus: season.plusMinus ?? 0,
        pim: season.pim ?? 0,
        shots: season.shots ?? 0,
        avgToi: season.avgToi ?? "N/A",
        gamesStarted: season.gamesStarted ?? 0,
        wins: season.wins ?? 0,
        losses: season.losses ?? 0,
        otLosses: season.otLosses ?? 0,
        goalsAgainstAvg: typeof season.goalsAgainstAvg === "number" ? season.goalsAgainstAvg.toFixed(2) : "0.00",
        savePctg: typeof season.savePctg === "number" ? season.savePctg.toFixed(3).replace(/^0/, "") : ".000",
        shutouts: season.shutouts ?? 0,
        shotsAgainst: season.shotsAgainst ?? 0,
        goalsAgainst: season.goalsAgainst ?? 0
      }))
      .reverse(),
    lastFiveGames: (player.last5Games ?? []).slice(0, 5).map((game) => ({
      gameId: game.gameId,
      date: game.gameDate,
      opponent: game.opponentAbbrev,
      goals: game.goals,
      assists: game.assists,
      points: game.points,
      decision: game.decision,
      goalsAgainst: game.goalsAgainst ?? 0,
      savePctg: typeof game.savePctg === "number" ? game.savePctg.toFixed(3).replace(/^0/, "") : ".000",
      shotsAgainst: game.shotsAgainst ?? 0,
      shots: game.shots ?? 0,
      toi: game.toi ?? "N/A"
    }))
  };
}

export async function getVgkGameDetail(gameId: number) {
  const [boxscore, rightRail, playByPlay] = await Promise.all([
    nhlApiFetch<GameBoxscore>(nhlEndpoints.boxscore(gameId)),
    nhlApiFetch<GameRightRail>(nhlEndpoints.gameRightRail(gameId)),
    nhlApiFetch<GamePlayByPlay>(nhlEndpoints.playByPlay(gameId))
  ]);

  const side = getVgkSide(boxscore);
  const players = side === "away" ? boxscore.playerByGameStats?.awayTeam : boxscore.playerByGameStats?.homeTeam;
  const awayPlayers = boxscore.playerByGameStats?.awayTeam;
  const homePlayers = boxscore.playerByGameStats?.homeTeam;
  const goals = scoringBreakdown(playByPlay, boxscore);
  const [awayMilestones, homeMilestones] = await Promise.all([
    careerMilestonesForTeam(awayPlayers),
    careerMilestonesForTeam(homePlayers)
  ]);

  return {
    id: boxscore.id,
    date: boxscore.startTimeUTC ?? boxscore.gameDate,
    gameState: boxscore.gameState,
    awayTeam: {
      abbrev: boxscore.awayTeam.abbrev,
      name: displayTeamName(boxscore.awayTeam),
      score: boxscore.awayTeam.score ?? 0,
      shots: boxscore.awayTeam.sog ?? 0
    },
    homeTeam: {
      abbrev: boxscore.homeTeam.abbrev,
      name: displayTeamName(boxscore.homeTeam),
      score: boxscore.homeTeam.score ?? 0,
      shots: boxscore.homeTeam.sog ?? 0
    },
    periodResult: boxscore.gameOutcome?.lastPeriodType ?? "REG",
    vgk: {
      side,
      topPointScorers: topPointScorers(players, 6),
      goalieSummary: goalieSummary(players)
    },
    milestoneWatch: {
      awayTeam: {
        abbrev: boxscore.awayTeam.abbrev,
        items: awayMilestones
      },
      homeTeam: {
        abbrev: boxscore.homeTeam.abbrev,
        items: homeMilestones
      }
    },
    teamStats: teamStatsFor(rightRail, boxscore),
    scoringByPeriod: rightRail.linescore?.byPeriod?.map((period) => {
      const key = periodKey(period.periodDescriptor);

      return {
        period: periodScoreLabel(period.periodDescriptor),
        away: period.away,
        home: period.home,
        goals: goals.filter((goal) => goal.period === key)
      };
    }) ?? []
  };
}

export async function getVgkScheduleForAlerts() {
  const schedule = await nhlApiFetch<ScheduleResponse>(nhlEndpoints.schedule);
  const standings = await nhlApiFetch<StandingsResponse>(nhlEndpoints.standings);
  const recordsByTeam = new Map(
    standings.standings.map((team) => [
      team.teamAbbrev.default,
      `${team.wins}-${team.losses}-${team.otLosses}`
    ])
  );

  return schedule.games.map((game) => {
    const side = getVgkSide(game);
    const opponent = getOpponent(game);
    const otherSide = side === "away" ? "home" : "away";

    return {
      id: game.id,
      date: game.startTimeUTC ?? game.gameDate,
      gameDate: game.gameDate,
      gameState: game.gameState,
      gameScheduleState: game.gameScheduleState,
      gameType: game.gameType,
      gameTypeLabel: getGameTypeLabel(game.gameType),
      lastPeriodType: game.gameOutcome?.lastPeriodType ?? game.periodDescriptor?.periodType ?? "REG",
      homeAway: side === "home" ? "Home" : "Away",
      opponent: opponent.abbrev,
      opponentName: displayTeamName(opponent),
      awayTeam: {
        abbrev: game.awayTeam.abbrev,
        id: game.awayTeam.id,
        record: recordsByTeam.get(game.awayTeam.abbrev) ?? "0-0-0"
      },
      homeTeam: {
        abbrev: game.homeTeam.abbrev,
        id: game.homeTeam.id,
        record: recordsByTeam.get(game.homeTeam.abbrev) ?? "0-0-0"
      },
      seriesStatus: game.seriesStatus,
      vgkScore: scoreFor(game, side),
      opponentScore: scoreFor(game, otherSide),
      score: `${VGK_ABBREV} ${scoreFor(game, side)}, ${opponent.abbrev} ${scoreFor(game, otherSide)}`
    };
  });
}

export async function getVgkGoalAlertsForGame(gameId: number) {
  const [boxscore, playByPlay] = await Promise.all([
    nhlApiFetch<GameBoxscore>(nhlEndpoints.boxscore(gameId)),
    nhlApiFetch<GamePlayByPlay>(nhlEndpoints.playByPlay(gameId))
  ]);

  return scoringBreakdown(playByPlay, boxscore).map((goal) => {
    const isVgkGoal = goal.teamAbbrev === VGK_ABBREV;
    const opponent =
      boxscore.awayTeam.abbrev === VGK_ABBREV ? boxscore.homeTeam.abbrev : boxscore.awayTeam.abbrev;
    const vgkScore = boxscore.awayTeam.abbrev === VGK_ABBREV ? goal.awayScore : goal.homeScore;
    const opponentScore = boxscore.awayTeam.abbrev === VGK_ABBREV ? goal.homeScore : goal.awayScore;
    const score = `${VGK_ABBREV} ${vgkScore} - ${opponent} ${opponentScore}`;
    const assistText =
      goal.assists.length > 0
        ? `from ${goal.assists.map((assist) => `${assist.name} (${assist.total})`).join(", ")}`
        : "unassisted";

    return {
      ...goal,
      gameId,
      isVgkGoal,
      opponent,
      title: `${isVgkGoal ? "GOLDEN KNIGHTS" : goal.teamAbbrev} GOAL\u{1F6A8}, ${score}`,
      body: `${goal.scorer} (${goal.scorerTotal}) ${assistText} @ ${goal.timeRemaining} remaining in ${goal.periodLabel}`
    };
  });
}

export async function getVgkUpdates() {
  const schedule = await nhlApiFetch<ScheduleResponse>(nhlEndpoints.schedule);
  const currentSeason = schedule.games[0]?.season ?? new Date().getFullYear();

  const [standings, roster, regularSeasonStats, playoffStats, playoffBracket] = await Promise.all([
    nhlApiFetch<StandingsResponse>(nhlEndpoints.standings),
    nhlApiFetch<RosterResponse>(nhlEndpoints.roster),
    nhlApiFetch<ClubStatsResponse>(nhlEndpoints.clubStats(currentSeason, 2)),
    nhlApiFetch<ClubStatsResponse>(nhlEndpoints.clubStats(currentSeason, 3)),
    getPlayoffBracketForSeason(currentSeason)
  ]);

  const completedGames = schedule.games.filter(isCompletedGame);
  const latestScheduleGame = completedGames.at(-1);
  const nextScheduleGame = schedule.games.find(isFutureGame);
  const todayKey = pacificDateKey(new Date());
  const todayScheduleGame = schedule.games.find((game) =>
    pacificDateKey(game.startTimeUTC ?? game.gameDate) === todayKey
  );
  const featuredScheduleGame = todayScheduleGame ?? latestScheduleGame;
  const oddsScheduleGame = todayScheduleGame ?? nextScheduleGame;
  const standing = standings.standings.find((team) => team.teamAbbrev.default === VGK_ABBREV);
  const rosterCount = (roster.forwards?.length ?? 0) + (roster.defensemen?.length ?? 0) + (roster.goalies?.length ?? 0);
  const bettingOdds = await getVgkBettingOdds(oddsScheduleGame);

  if (!latestScheduleGame) {
    throw new Error("No completed VGK games were returned by the NHL schedule endpoint.");
  }

  return {
    overview: {
      featuredGame: featuredScheduleGame
        ? {
            id: featuredScheduleGame.id,
            label: featuredGameLabel(featuredScheduleGame, featuredScheduleGame === todayScheduleGame),
            status: featuredScheduleGame.gameState,
            score: scoreLine(featuredScheduleGame),
            opponent: displayTeamName(getOpponent(featuredScheduleGame)),
            opponentAbbrev: getOpponent(featuredScheduleGame).abbrev,
            date: featuredScheduleGame.startTimeUTC ?? featuredScheduleGame.gameDate,
            homeAway: getVgkSide(featuredScheduleGame) === "home" ? "Home" : "Away",
            isToday: featuredScheduleGame === todayScheduleGame,
            isLive: isLiveGame(featuredScheduleGame)
          }
        : null,
      bettingOdds,
      latestGame: {
        id: latestScheduleGame.id,
        result: gameResult(latestScheduleGame),
        score: scoreLine(latestScheduleGame),
        opponent: displayTeamName(getOpponent(latestScheduleGame)),
        date: latestScheduleGame.startTimeUTC ?? latestScheduleGame.gameDate
      },
      nextGame: nextScheduleGame
        ? {
            id: nextScheduleGame.id,
            opponent: displayTeamName(getOpponent(nextScheduleGame)),
            opponentAbbrev: getOpponent(nextScheduleGame).abbrev,
            date: nextScheduleGame.startTimeUTC ?? nextScheduleGame.gameDate,
            homeAway: getVgkSide(nextScheduleGame) === "home" ? "Home" : "Away",
            status: nextScheduleGame.gameScheduleState ?? nextScheduleGame.gameState
          }
        : null,
      teamSnapshot: standing
        ? {
            record: `${standing.wins}-${standing.losses}-${standing.otLosses}`,
            points: standing.points,
            standingsPosition: `${ordinal(standing.divisionSequence)} ${standing.divisionName ?? "division"}`,
            conferencePosition: `${ordinal(standing.conferenceSequence)} ${standing.conferenceName ?? "conference"}`,
            gamesPlayed: standing.gamesPlayed,
            rosterCount
          }
        : null
    },
    leaderGroups: {
      regularSeason: makeLeaders(regularSeasonStats),
      playoffs: makeLeaders(playoffStats)
    },
    playoffBracket,
    games: completedGames.reverse().map((game) => {
      const side = getVgkSide(game);
      const opponent = getOpponent(game);
      const otherSide = side === "away" ? "home" : "away";

      return {
        id: game.id,
        date: game.startTimeUTC ?? game.gameDate,
        gameType: game.gameType,
        gameTypeLabel: getGameTypeLabel(game.gameType),
        opponent: opponent.abbrev,
        opponentName: displayTeamName(opponent),
        homeAway: side === "home" ? "Home" : "Away",
        result: gameResult(game),
        score: `${scoreFor(game, side)}-${scoreFor(game, otherSide)}`,
        vgkScore: scoreFor(game, side),
        opponentScore: scoreFor(game, otherSide)
      };
    })
  };
}

export type VgkGameDetail = Awaited<ReturnType<typeof getVgkGameDetail>>;
export type VgkGoalAlert = Awaited<ReturnType<typeof getVgkGoalAlertsForGame>>[number];
export type VgkScheduleAlertGame = Awaited<ReturnType<typeof getVgkScheduleForAlerts>>[number];
export type VgkPlayerCardData = Awaited<ReturnType<typeof getVgkPlayerCard>>;
export type VgkUpdatesData = Awaited<ReturnType<typeof getVgkUpdates>>;
