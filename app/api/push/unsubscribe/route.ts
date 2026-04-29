import { NextResponse } from "next/server";

import { getPushStorageMode, removePushSubscription } from "@/lib/push-subscriptions";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    endpoint?: string;
  };

  if (!body.endpoint) {
    return NextResponse.json({ error: "Missing push endpoint." }, { status: 400 });
  }

  const count = await removePushSubscription(body.endpoint);

  return NextResponse.json({
    ok: true,
    storage: getPushStorageMode(),
    subscriptionCount: count
  });
}
