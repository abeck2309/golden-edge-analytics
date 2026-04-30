import { NextResponse } from "next/server";

import { getVgkUpdates } from "@/lib/nhl-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getVgkUpdates();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
