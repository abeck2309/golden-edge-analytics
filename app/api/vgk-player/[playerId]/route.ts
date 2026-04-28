import { NextResponse } from "next/server";
import { getVgkPlayerCard } from "@/lib/nhl-api";

export async function GET(_request: Request, { params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params;
  const parsedPlayerId = Number(playerId);

  if (!Number.isFinite(parsedPlayerId)) {
    return NextResponse.json({ error: "Invalid player id." }, { status: 400 });
  }

  const player = await getVgkPlayerCard(parsedPlayerId);
  return NextResponse.json(player);
}
