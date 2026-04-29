import { NextResponse } from "next/server";

import { getPushStorageMode } from "@/lib/push-subscriptions";
import { sendPushNotification } from "@/lib/push-send";
import { isWebPushConfigured } from "@/lib/web-push";

export async function POST() {
  if (!isWebPushConfigured()) {
    return NextResponse.json(
      { error: "Web push is not configured. Add VAPID environment variables first." },
      { status: 503 }
    );
  }

  const examples = [
    {
      body: "VGK (49-22-11) @ UTA (38-31-13)",
      tag: "golden-edge-test-game-start",
      title: "VGK Game Starting Now⚔️",
      topic: "game-start"
    },
    {
      body: "Mark Stone (2) from Jack Eichel (1), Mitch Marner (2) @ 03:44 remaining in 2nd period",
      tag: "golden-edge-test-goal",
      title: "GOLDEN KNIGHTS GOAL🚨, VGK 1 - UTA 0",
      topic: "goals"
    },
    {
      body: "Tap to view the game details.",
      tag: "golden-edge-test-final",
      title: "Final OT: VGK WIN🃏 VGK 5 - UTA 4",
      topic: "final-score"
    }
  ] as const;

  const results = await Promise.all(
    examples.map((example) =>
      sendPushNotification({
        body: example.body,
        data: {
          type: "test",
          category: "vgk-update"
        },
        tag: example.tag,
        title: example.title,
        topic: example.topic,
        url: "/vgk-updates"
      })
    )
  );
  const result = results.reduce(
    (summary, current) => ({
      failed: summary.failed + current.failed,
      sent: summary.sent + current.sent,
      total: summary.total + current.total
    }),
    { failed: 0, sent: 0, total: 0 }
  );

  return NextResponse.json({
    ok: true,
    examples: examples.length,
    ...result,
    storage: getPushStorageMode()
  });
}
