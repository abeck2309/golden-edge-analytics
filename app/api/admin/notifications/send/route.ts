import { NextResponse } from "next/server";

import { isAdminRequest, unauthorizedJson } from "@/lib/admin-auth";
import { sendPushNotification } from "@/lib/push-send";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorizedJson();
  }

  const body = (await request.json()) as {
    body?: string;
    tag?: string;
    title?: string;
    url?: string;
  };

  if (!body.title?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
  }

  const result = await sendPushNotification({
    body: body.body.trim(),
    data: {
      type: "custom",
      category: "admin"
    },
    tag: body.tag?.trim() || "golden-edge-custom",
    title: body.title.trim(),
    topic: "vgk-news",
    url: body.url?.trim() || "/vgk-updates"
  });

  return NextResponse.json({
    ok: true,
    ...result
  });
}
