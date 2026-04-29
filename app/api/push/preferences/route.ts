import { NextResponse } from "next/server";
import type { PushSubscription } from "web-push";

import { getPushSubscriptionByEndpoint, savePushSubscription } from "@/lib/push-subscriptions";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    endpoint?: string;
  };

  if (!body.endpoint) {
    return NextResponse.json({ error: "Missing push endpoint." }, { status: 400 });
  }

  const record = await getPushSubscriptionByEndpoint(body.endpoint);

  return NextResponse.json({
    ok: true,
    topics: record?.topics ?? ["game-start", "goals", "final-score", "vgk-news"]
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    subscription?: PushSubscription;
    topics?: string[];
  };

  if (!body.subscription?.endpoint || !Array.isArray(body.topics)) {
    return NextResponse.json({ error: "Missing push subscription or topics." }, { status: 400 });
  }

  const count = await savePushSubscription(body.subscription, body.topics);

  return NextResponse.json({
    ok: true,
    subscriptionCount: count,
    topics: body.topics
  });
}
