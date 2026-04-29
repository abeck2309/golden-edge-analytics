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

  const result = await sendPushNotification({
    title: "Golden Edge Analytics",
    body: "VGK alerts are turned on.",
    url: "/vgk-updates",
    tag: "golden-edge-test",
    data: {
      type: "test",
      category: "vgk-update"
    }
  });

  return NextResponse.json({
    ok: true,
    ...result,
    storage: getPushStorageMode()
  });
}
