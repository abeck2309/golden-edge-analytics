import { NextResponse } from "next/server";

import { getVgkUpdates } from "@/lib/nhl-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getVgkUpdates();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, max-age=20"
      }
    });
  } catch {
    return NextResponse.json(
      { error: "VGK updates are temporarily unavailable." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
