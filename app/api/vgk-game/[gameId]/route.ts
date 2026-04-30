import { NextResponse } from "next/server";
import { getVgkGameDetail } from "@/lib/nhl-api";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const parsedGameId = Number(gameId);

  if (!Number.isFinite(parsedGameId)) {
    return NextResponse.json({ error: "Invalid game id." }, { status: 400 });
  }

  const detail = await getVgkGameDetail(parsedGameId);
  return NextResponse.json(detail, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
