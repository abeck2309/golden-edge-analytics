const NHL_WEB_BASE_URL = "https://api-web.nhle.com/v1";
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
};

type ScheduleResponse = {
  clubTimezone?: string;
  games: ScheduleGame[];
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
  typeDescKey: string;
  details?: {
    scoringPlayerId?: number;
    scoringPlayerTotal?: number;
    assist1PlayerId?: number;
    assist1PlayerTotal?: number;
    assist2PlayerId?: number;
    assist2PlayerTotal?: number;
    eventOwnerTeamId?: number;
    awayScore?: number;
    homeScore?: number;
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
  clubStats: (season: number, gameType: 2 | 3) => `${NHL_WEB_BASE_URL}/club-stats/${VGK_ABBREV}/${season}/${gameType}`
};

async function nhlApiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: 300
    }
  });

  if (!response.ok) {
    throw new Error(`NHL API request failed (${response.status}) for ${url}`);
  }

  return response.json() as Promise<T>;
}

function nameFromParts(firstName?: LocalizedString, lastName?: LocalizedString) {
  return [firstName?.default, lastName?.default].filter(Boolean).join(" ");
}

function displayTeamName(team: TeamInGame) {
  return [team.placeName?.default, team.commonName?.default].filter(Boolean).join(" ");
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

function teamStatsFor(rightRail: GameRightRail, game: GameBoxscore) {
  return (rightRail.teamGameStats ?? []).map((stat) => ({
    category: stat.category,
    label: stat.category
      .replace(/Pctg$/, " %")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (letter) => letter.toUpperCase()),
    awayValue: stat.awayValue,
    homeValue: stat.homeValue
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

function periodKey(period: { number: number; periodType: string }) {
  return period.periodType === "REG" ? String(period.number) : period.periodType;
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
        time: play.timeInPeriod,
        teamAbbrev: scoringTeam?.abbrev ?? "NHL",
        scorerPlayerId: play.details?.scoringPlayerId,
        scorer: playerName(play.details?.scoringPlayerId, rosterById),
        scorerTotal: play.details?.scoringPlayerTotal ?? 0,
        assists: assists.map((assist, index) => ({
          ...assist,
          playerId: index === 0 ? play.details?.assist1PlayerId : play.details?.assist2PlayerId
        })),
        score: `${play.details?.awayScore ?? 0}-${play.details?.homeScore ?? 0}`
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
    teamStats: teamStatsFor(rightRail, boxscore),
    scoringByPeriod: rightRail.linescore?.byPeriod?.map((period) => {
      const key = periodKey(period.periodDescriptor);

      return {
        period: key,
        away: period.away,
        home: period.home,
        goals: scoringBreakdown(playByPlay, boxscore).filter((goal) => goal.period === key)
      };
    }) ?? []
  };
}

export async function getVgkScheduleForAlerts() {
  const schedule = await nhlApiFetch<ScheduleResponse>(nhlEndpoints.schedule);

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
      homeAway: side === "home" ? "Home" : "Away",
      opponent: opponent.abbrev,
      opponentName: displayTeamName(opponent),
      awayTeam: {
        abbrev: game.awayTeam.abbrev,
        id: game.awayTeam.id
      },
      homeTeam: {
        abbrev: game.homeTeam.abbrev,
        id: game.homeTeam.id
      },
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

    return {
      ...goal,
      gameId,
      isVgkGoal,
      opponent,
      title: isVgkGoal ? "VGK Goal" : `${goal.teamAbbrev} Goal`,
      body: `${goal.scorer} (${goal.scorerTotal}) scores. ${VGK_ABBREV} vs ${opponent}: ${goal.score}`
    };
  });
}

export async function getVgkUpdates() {
  const schedule = await nhlApiFetch<ScheduleResponse>(nhlEndpoints.schedule);
  const currentSeason = schedule.games[0]?.season ?? new Date().getFullYear();

  const [standings, roster, regularSeasonStats, playoffStats] = await Promise.all([
    nhlApiFetch<StandingsResponse>(nhlEndpoints.standings),
    nhlApiFetch<RosterResponse>(nhlEndpoints.roster),
    nhlApiFetch<ClubStatsResponse>(nhlEndpoints.clubStats(currentSeason, 2)),
    nhlApiFetch<ClubStatsResponse>(nhlEndpoints.clubStats(currentSeason, 3))
  ]);

  const completedGames = schedule.games.filter(isCompletedGame);
  const latestScheduleGame = completedGames.at(-1);
  const nextScheduleGame = schedule.games.find(isFutureGame);
  const standing = standings.standings.find((team) => team.teamAbbrev.default === VGK_ABBREV);
  const rosterCount = (roster.forwards?.length ?? 0) + (roster.defensemen?.length ?? 0) + (roster.goalies?.length ?? 0);

  if (!latestScheduleGame) {
    throw new Error("No completed VGK games were returned by the NHL schedule endpoint.");
  }

  return {
    overview: {
      latestGame: {
        id: latestScheduleGame.id,
        result: gameResult(latestScheduleGame),
        score: `${VGK_ABBREV} ${scoreFor(latestScheduleGame, getVgkSide(latestScheduleGame))}, ${getOpponent(latestScheduleGame).abbrev} ${scoreFor(
          latestScheduleGame,
          getVgkSide(latestScheduleGame) === "away" ? "home" : "away"
        )}`,
        opponent: displayTeamName(getOpponent(latestScheduleGame)),
        date: latestScheduleGame.startTimeUTC ?? latestScheduleGame.gameDate
      },
      nextGame: nextScheduleGame
        ? {
            opponent: displayTeamName(getOpponent(nextScheduleGame)),
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
