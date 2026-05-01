import { NextResponse } from "next/server";

import { getAutomatedAlertLog } from "@/lib/push-alert-state";

function fallbackUrl(type: string) {
  if (type === "game-start" || type === "final-score") {
    return "/vgk-updates#live-game";
  }

  return "/vgk-updates";
}

export async function GET() {
  const entries = await getAutomatedAlertLog();

  return NextResponse.json({
    entries: entries.map((entry) => ({
      body: entry.body,
      key: entry.key,
      sentAt: entry.sentAt,
      title: entry.title,
      type: entry.type,
      url: entry.url ?? fallbackUrl(entry.type)
    })),
    ok: true
  });
}
