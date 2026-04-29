import { NextResponse } from "next/server";
import type { PushSubscription } from "web-push";

import {
  getPushStorageMode,
  getPushSubscriptionCount,
  savePushSubscription
} from "@/lib/push-subscriptions";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    subscription?: PushSubscription;
    topics?: string[];
  };

  if (!body.subscription?.endpoint) {
    return NextResponse.json({ error: "Missing push subscription." }, { status: 400 });
  }

  const count = await savePushSubscription(body.subscription, body.topics);

  return NextResponse.json({
    ok: true,
    storage: getPushStorageMode(),
    subscriptionCount: count
  });
}

export async function GET() {
  return NextResponse.json({
    storage: getPushStorageMode(),
    subscriptionCount: await getPushSubscriptionCount()
  });
}
