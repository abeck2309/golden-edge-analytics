import { Redis } from "@upstash/redis";
import type { PushSubscription } from "web-push";

export type PushSubscriptionRecord = {
  createdAt: string;
  endpoint: string;
  subscription: PushSubscription;
  topics: string[];
};

const PUSH_SET_KEY = "golden-edge:push-subscriptions";
const PUSH_RECORD_PREFIX = "golden-edge:push-subscription:";

const pushStore = globalThis as typeof globalThis & {
  goldenEdgePushSubscriptions?: Map<string, PushSubscriptionRecord>;
};

const memorySubscriptions =
  pushStore.goldenEdgePushSubscriptions ?? new Map<string, PushSubscriptionRecord>();

pushStore.goldenEdgePushSubscriptions = memorySubscriptions;

function hasRedisEnv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function getRedis() {
  if (!hasRedisEnv()) {
    return null;
  }

  return Redis.fromEnv();
}

function recordKey(endpoint: string) {
  return `${PUSH_RECORD_PREFIX}${encodeURIComponent(endpoint)}`;
}

export function getPushStorageMode() {
  return hasRedisEnv() ? "redis" : "memory";
}

export async function savePushSubscription(
  subscription: PushSubscription,
  topics = ["vgk-updates"]
) {
  const record: PushSubscriptionRecord = {
    createdAt: new Date().toISOString(),
    endpoint: subscription.endpoint,
    subscription,
    topics
  };

  const redis = getRedis();

  if (!redis) {
    memorySubscriptions.set(subscription.endpoint, record);
    return memorySubscriptions.size;
  }

  await redis.sadd(PUSH_SET_KEY, subscription.endpoint);
  await redis.set(recordKey(subscription.endpoint), record);

  return redis.scard(PUSH_SET_KEY);
}

export async function removePushSubscription(endpoint: string) {
  const redis = getRedis();

  if (!redis) {
    memorySubscriptions.delete(endpoint);
    return memorySubscriptions.size;
  }

  await redis.srem(PUSH_SET_KEY, endpoint);
  await redis.del(recordKey(endpoint));

  return redis.scard(PUSH_SET_KEY);
}

export async function getPushSubscriptions() {
  const redis = getRedis();

  if (!redis) {
    return Array.from(memorySubscriptions.values());
  }

  const endpoints = await redis.smembers<string[]>(PUSH_SET_KEY);

  if (endpoints.length === 0) {
    return [];
  }

  const records = await Promise.all(
    endpoints.map((endpoint) => redis.get<PushSubscriptionRecord>(recordKey(endpoint)))
  );

  return records.filter((record): record is PushSubscriptionRecord => Boolean(record));
}

export async function getPushSubscriptionCount() {
  const redis = getRedis();

  if (!redis) {
    return memorySubscriptions.size;
  }

  return redis.scard(PUSH_SET_KEY);
}
