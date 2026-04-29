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
const FINAL_GOAL_CAPTURE_WINDOW = 10 * 60 * 1000;

type AutomatedCandidate = {
  body: string;
  key: string;
  tag: string;
  title: string;
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

function shouldCheckGoals(game: VgkScheduleAlertGame, now: number) {
  const sinceStart = now - gameStartTime(game);

  return (
    (isLiveState(game) && sinceStart >= 0 && sinceStart <= TWELVE_HOURS) ||
    (isFinalState(game) && sinceStart >= 0 && sinceStart <= FINAL_GOAL_CAPTURE_WINDOW)
  );
}

function buildGameStartCandidate(game: VgkScheduleAlertGame, now: number): AutomatedCandidate | null {
  const start = gameStartTime(game);
  const sinceStart = now - start;
  const location = game.homeAway === "Home" ? "at home" : "on the road";

  if (sinceStart >= 0 && sinceStart <= START_ALERT_WINDOW) {
    return {
      body: `VGK faces ${game.opponent} ${location}. Puck drop is scheduled now.`,
      key: `game-start:${game.id}`,
      tag: `vgk-game-start-${game.id}`,
      title: "VGK Game Starting",
      type: "game-start",
      url: "/vgk-updates"
    };
  }

  return null;
}

function buildFinalScoreCandidate(game: VgkScheduleAlertGame, now: number): AutomatedCandidate | null {
  const sinceStart = now - gameStartTime(game);

  if (isFinalState(game) && sinceStart >= 0 && sinceStart <= TWELVE_HOURS) {
    const result = game.vgkScore > game.opponentScore ? "win" : "fall";

    return {
      body: `Final: ${game.score}. VGK ${result} against ${game.opponent}.`,
      key: `final-score:${game.id}`,
      tag: `vgk-final-score-${game.id}`,
      title: "VGK Final Score",
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
