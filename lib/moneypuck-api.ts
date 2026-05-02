import { inflateRawSync } from "node:zlib";
import { unstable_cache } from "next/cache";

const MONEYPUCK_SHOTS_URL = "https://peter-tanner.com/moneypuck/downloads/shots_2025.zip";

type ZipEntry = {
  compressedSize: number;
  compressionMethod: number;
  localHeaderOffset: number;
  name: string;
};

export type MoneyPuckShot = {
  event: string;
  gameId: number;
  goal: boolean;
  goalieName: string;
  isPlayoffGame: boolean;
  period: number;
  season: number;
  shotType: string;
  teamCode: string;
  time: number;
  x: number;
  xGoal: number;
  y: number;
};

export type MoneyPuckPlayerShotChart = {
  credit: string;
  lastUpdated: string;
  playerId: number;
  season: number;
  shots: MoneyPuckShot[];
  source: string;
  summary: {
    goals: number;
    playoffShots: number;
    regularSeasonShots: number;
    shots: number;
    xGoals: number;
  };
};

function readUInt32LE(buffer: Buffer, offset: number) {
  return buffer.readUInt32LE(offset);
}

function readUInt16LE(buffer: Buffer, offset: number) {
  return buffer.readUInt16LE(offset);
}

function getFirstZipEntry(buffer: Buffer): ZipEntry {
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (readUInt32LE(buffer, offset) !== 0x06054b50) continue;

    const centralDirectoryOffset = readUInt32LE(buffer, offset + 16);
    const signature = readUInt32LE(buffer, centralDirectoryOffset);

    if (signature !== 0x02014b50) {
      break;
    }

    const compressionMethod = readUInt16LE(buffer, centralDirectoryOffset + 10);
    const compressedSize = readUInt32LE(buffer, centralDirectoryOffset + 20);
    const fileNameLength = readUInt16LE(buffer, centralDirectoryOffset + 28);
    const localHeaderOffset = readUInt32LE(buffer, centralDirectoryOffset + 42);
    const name = buffer
      .subarray(centralDirectoryOffset + 46, centralDirectoryOffset + 46 + fileNameLength)
      .toString("utf8");

    return { compressedSize, compressionMethod, localHeaderOffset, name };
  }

  throw new Error("Unable to read MoneyPuck shot zip.");
}

function unzipFirstCsv(buffer: Buffer) {
  const entry = getFirstZipEntry(buffer);
  const localSignature = readUInt32LE(buffer, entry.localHeaderOffset);

  if (localSignature !== 0x04034b50) {
    throw new Error("Invalid MoneyPuck shot zip.");
  }

  const fileNameLength = readUInt16LE(buffer, entry.localHeaderOffset + 26);
  const extraFieldLength = readUInt16LE(buffer, entry.localHeaderOffset + 28);
  const dataStart = entry.localHeaderOffset + 30 + fileNameLength + extraFieldLength;
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize);

  if (entry.compressionMethod === 0) {
    return compressed.toString("utf8");
  }

  if (entry.compressionMethod === 8) {
    return inflateRawSync(compressed).toString("utf8");
  }

  throw new Error(`Unsupported MoneyPuck zip compression: ${entry.compressionMethod}`);
}

function splitCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function numberValue(value: string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function columnIndex(header: string[], column: string) {
  const index = header.indexOf(column);

  if (index === -1) {
    throw new Error(`MoneyPuck shot data is missing ${column}.`);
  }

  return index;
}

async function fetchCurrentShotCsv() {
  const response = await fetch(MONEYPUCK_SHOTS_URL, {
    next: { revalidate: 60 * 60 * 6 }
  });

  if (!response.ok) {
    throw new Error("Unable to load MoneyPuck shot data.");
  }

  const lastUpdated = response.headers.get("last-modified") ?? new Date().toISOString();
  const buffer = Buffer.from(await response.arrayBuffer());

  return {
    csv: unzipFirstCsv(buffer),
    lastUpdated
  };
}

export const getMoneyPuckPlayerShotChart = unstable_cache(
  async (playerId: number): Promise<MoneyPuckPlayerShotChart> => {
    const { csv, lastUpdated } = await fetchCurrentShotCsv();
    const lines = csv.split(/\r?\n/);
    const header = splitCsvLine(lines[0] ?? "");
    const indexes = {
      gameId: columnIndex(header, "game_id"),
      goal: columnIndex(header, "goal"),
      goalieName: columnIndex(header, "goalieNameForShot"),
      isPlayoffGame: columnIndex(header, "isPlayoffGame"),
      period: columnIndex(header, "period"),
      season: columnIndex(header, "season"),
      shooterPlayerId: columnIndex(header, "shooterPlayerId"),
      shotType: columnIndex(header, "shotType"),
      teamCode: columnIndex(header, "teamCode"),
      time: columnIndex(header, "time"),
      x: columnIndex(header, "arenaAdjustedXCordABS"),
      xGoal: columnIndex(header, "xGoal"),
      y: columnIndex(header, "arenaAdjustedYCord")
    };

    const shots: MoneyPuckShot[] = [];

    for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      if (!line) continue;

      const values = splitCsvLine(line);
      if (numberValue(values[indexes.shooterPlayerId]) !== playerId) continue;

      shots.push({
        event: values[indexes.goal] === "1" ? "GOAL" : "SHOT",
        gameId: numberValue(values[indexes.gameId]),
        goal: values[indexes.goal] === "1",
        goalieName: values[indexes.goalieName] || "N/A",
        isPlayoffGame: values[indexes.isPlayoffGame] === "1",
        period: numberValue(values[indexes.period]),
        season: numberValue(values[indexes.season]),
        shotType: values[indexes.shotType] || "N/A",
        teamCode: values[indexes.teamCode] || "N/A",
        time: numberValue(values[indexes.time]),
        x: Math.abs(numberValue(values[indexes.x])),
        xGoal: numberValue(values[indexes.xGoal]),
        y: numberValue(values[indexes.y])
      });
    }

    const goals = shots.filter((shot) => shot.goal).length;
    const xGoals = shots.reduce((sum, shot) => sum + shot.xGoal, 0);

    return {
      credit: "Shot data via MoneyPuck.com.",
      lastUpdated,
      playerId,
      season: 2025,
      shots,
      source: MONEYPUCK_SHOTS_URL,
      summary: {
        goals,
        playoffShots: shots.filter((shot) => shot.isPlayoffGame).length,
        regularSeasonShots: shots.filter((shot) => !shot.isPlayoffGame).length,
        shots: shots.length,
        xGoals: Number(xGoals.toFixed(2))
      }
    };
  },
  ["moneypuck-player-shot-chart"],
  { revalidate: 60 * 60 * 6 }
);
