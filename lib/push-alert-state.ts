import { Redis } from "@upstash/redis";

const SENT_ALERTS_KEY = "golden-edge:push-alerts:sent";
const ALERT_LOG_KEY = "golden-edge:push-alerts:log";
const MAX_LOG_ENTRIES = 50;

export type AutomatedAlertLogEntry = {
  body: string;
  failed: number;
  key: string;
  sent: number;
  sentAt: string;
  title: string;
  total: number;
  type: string;
};

const alertStore = globalThis as typeof globalThis & {
  goldenEdgeAutomatedAlertLog?: AutomatedAlertLogEntry[];
  goldenEdgeSentPushAlerts?: Set<string>;
};

const memorySentAlerts = alertStore.goldenEdgeSentPushAlerts ?? new Set<string>();
const memoryAlertLog = alertStore.goldenEdgeAutomatedAlertLog ?? [];

alertStore.goldenEdgeSentPushAlerts = memorySentAlerts;
alertStore.goldenEdgeAutomatedAlertLog = memoryAlertLog;

function hasRedisEnv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function getRedis() {
  return hasRedisEnv() ? Redis.fromEnv() : null;
}

export async function hasAlertBeenSent(key: string) {
  const redis = getRedis();

  if (!redis) {
    return memorySentAlerts.has(key);
  }

  return (await redis.sismember(SENT_ALERTS_KEY, key)) === 1;
}

export async function markAlertSent(key: string) {
  const redis = getRedis();

  if (!redis) {
    memorySentAlerts.add(key);
    return;
  }

  await redis.sadd(SENT_ALERTS_KEY, key);
}

export async function logAutomatedAlert(entry: AutomatedAlertLogEntry) {
  const redis = getRedis();

  if (!redis) {
    memoryAlertLog.unshift(entry);
    memoryAlertLog.splice(MAX_LOG_ENTRIES);
    return;
  }

  await redis.lpush(ALERT_LOG_KEY, JSON.stringify(entry));
  await redis.ltrim(ALERT_LOG_KEY, 0, MAX_LOG_ENTRIES - 1);
}

export async function getAutomatedAlertLog() {
  const redis = getRedis();

  if (!redis) {
    return memoryAlertLog;
  }

  const entries = await redis.lrange<string>(ALERT_LOG_KEY, 0, MAX_LOG_ENTRIES - 1);

  return entries
    .map((entry) => {
      try {
        return JSON.parse(entry) as AutomatedAlertLogEntry;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is AutomatedAlertLogEntry => Boolean(entry));
}
