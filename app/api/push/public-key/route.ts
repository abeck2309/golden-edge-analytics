import { NextResponse } from "next/server";

import { getVapidPublicKey, isWebPushConfigured } from "@/lib/web-push";

export async function GET() {
  return NextResponse.json({
    configured: isWebPushConfigured(),
    publicKey: getVapidPublicKey()
  });
}
