import { NextResponse } from "next/server";

import { isCronRequest, unauthorizedJson } from "@/lib/admin-auth";
import { hasAlertBeenSent, logAutomatedAlert, markAlertSent } from "@/lib/push-alert-state";
import { sendPushNotification } from "@/lib/push-send";
import {
  getVgkGoalAlertsForGame,
  getVgkScheduleForAlerts,
  type VgkScheduleAlertGame
} from "@/lib/nhl-api";

const START_ALERT_WINDOW = 10 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

type AutomatedCandidate = {
  body: string;
  key: string;
  tag: string;
  title: string;
  topic: "game-start" | "goals" | "final-score";
  type: "game-start" | "goal" | "final-score";
  url: string;
};

function gameStartTime(game: VgkScheduleAlertGame) {
  return new Date(game.date).getTime();
}

function isLiveState(game: VgkScheduleAlertGame) {
  return ["LIVE", "CRIT"].includes(game.gameState);
}

function isFinalState(game: VgkScheduleAlertGame) {
  return ["FINAL", "OFF"].includes(game.gameState);
}

function seriesText(game: VgkScheduleAlertGame) {
  const status = game.seriesStatus;

  if (!status) {
    return "";
  }

  const topSeedIsHome = [1, 2, 5, 7].includes(status.gameNumberOfSeries);
  const topSeed = topSeedIsHome ? game.homeTeam.abbrev : game.awayTeam.abbrev;
  const bottomSeed = topSeedIsHome ? game.awayTeam.abbrev : game.homeTeam.abbrev;

  if (status.topSeedWins === status.bottomSeedWins) {
    return `(Series tied ${status.topSeedWins}-${status.bottomSeedWins})`;
  }

  const leader = status.topSeedWins > status.bottomSeedWins ? topSeed : bottomSeed;
  const leaderWins = Math.max(status.topSeedWins, status.bottomSeedWins);
  const trailingWins = Math.min(status.topSeedWins, status.bottomSeedWins);

  return `(${leader} leads series ${leaderWins}-${trailingWins})`;
}

function gameStartText(game: VgkScheduleAlertGame) {
  if (game.gameType === 3) {
    return `${game.awayTeam.abbrev} @ ${game.homeTeam.abbrev} ${seriesText(game)}`.trim();
  }

  return `${game.awayTeam.abbrev} (${game.awayTeam.record}) @ ${game.homeTeam.abbrev} (${game.homeTeam.record})`;
}

function finalLabel(game: VgkScheduleAlertGame) {
  return ["OT", "SO"].includes(game.lastPeriodType) ? `Final (${game.lastPeriodType})` : "Final";
}

function shouldCheckGoals(game: VgkScheduleAlertGame, now: number) {
  const sinceStart = now - gameStartTime(game);

  return (
    (isLiveState(game) && sinceStart >= 0 && sinceStart <= TWELVE_HOURS) ||
    (isFinalState(game) && sinceStart >= 0 && sinceStart <= TWELVE_HOURS)
  );
}

function buildGameStartCandidate(game: VgkScheduleAlertGame, now: number): AutomatedCandidate | null {
  const start = gameStartTime(game);
  const sinceStart = now - start;

  if (sinceStart >= 0 && sinceStart <= START_ALERT_WINDOW) {
    return {
      body: gameStartText(game),
      key: `game-start:${game.id}`,
      tag: `vgk-game-start-${game.id}`,
      title: "VGK Game Starting Now\u2694\uFE0F",
      topic: "game-start",
      type: "game-start",
      url: "/vgk-updates"
    };
  }

  return null;
}

function buildFinalScoreCandidate(game: VgkScheduleAlertGame, now: number): AutomatedCandidate | null {
  const sinceStart = now - gameStartTime(game);

  if (isFinalState(game) && sinceStart >= 0 && sinceStart <= TWELVE_HOURS) {
    const result = game.vgkScore > game.opponentScore ? "WIN\u{1F0CF}" : "LOSE\u{1F645}";

    return {
      body: "Tap to view the game details.",
      key: `final-score:${game.id}`,
      tag: `vgk-final-score-${game.id}`,
      title: `${finalLabel(game)}: VGK ${result} ${game.score}`,
      topic: "final-score",
      type: "final-score",
      url: "/vgk-updates"
    };
  }

  return null;
}

async function buildGoalCandidates(game: VgkScheduleAlertGame, now: number) {
  if (!shouldCheckGoals(game, now)) {
    return [];
  }

  const goals = await getVgkGoalAlertsForGame(game.id);

  return goals.map((goal): AutomatedCandidate => ({
    body: goal.body,
    key: `goal:${game.id}:${goal.eventId}`,
    tag: `vgk-goal-${game.id}-${goal.eventId}`,
    title: goal.title,
    topic: "goals",
    type: "goal",
    url: "/vgk-updates"
  }));
}

export async function GET(request: Request) {
  if (!isCronRequest(request)) {
    return unauthorizedJson();
  }

  const now = Date.now();
  const schedule = await getVgkScheduleForAlerts();
  const startAndFinalCandidates = schedule
    .flatMap((game) => [buildGameStartCandidate(game, now), buildFinalScoreCandidate(game, now)])
    .filter((candidate): candidate is AutomatedCandidate => Boolean(candidate));
  const goalCandidateGroups = await Promise.all(schedule.map((game) => buildGoalCandidates(game, now)));
  const candidates = [...startAndFinalCandidates, ...goalCandidateGroups.flat()];

  const sent = [];
  const skipped = [];

  for (const candidate of candidates) {
    if (await hasAlertBeenSent(candidate.key)) {
      skipped.push(candidate.key);
      continue;
    }

    const result = await sendPushNotification({
      body: candidate.body,
      data: {
        type: candidate.type,
        category: "vgk-update"
      },
      tag: candidate.tag,
      title: candidate.title,
      topic: candidate.topic,
      url: candidate.url
    });

    await markAlertSent(candidate.key);
    await logAutomatedAlert({
      body: candidate.body,
      failed: result.failed,
      key: candidate.key,
      sent: result.sent,
      sentAt: new Date().toISOString(),
      title: candidate.title,
      total: result.total,
      type: candidate.type
    });
    sent.push({ ...candidate, ...result });
  }

  return NextResponse.json({
    checkedAt: new Date(now).toISOString(),
    candidates: candidates.length,
    ok: true,
    sent,
    skipped
  });
}
