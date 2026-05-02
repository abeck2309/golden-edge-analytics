import { NextResponse } from "next/server";
import { getMoneyPuckPlayerShotChart } from "@/lib/moneypuck-api";

export async function GET(_request: Request, { params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params;
  const parsedPlayerId = Number(playerId);

  if (!Number.isFinite(parsedPlayerId)) {
    return NextResponse.json({ error: "Invalid player id." }, { status: 400 });
  }

  try {
    const chart = await getMoneyPuckPlayerShotChart(parsedPlayerId);
    return NextResponse.json(chart);
  } catch {
    return NextResponse.json({ error: "Unable to load MoneyPuck shot data." }, { status: 502 });
  }
}
