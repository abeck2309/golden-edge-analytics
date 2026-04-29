import {
  getPushSubscriptions,
  removePushSubscription
} from "@/lib/push-subscriptions";
import { configureWebPush, isWebPushConfigured, webpush } from "@/lib/web-push";

export type PushPayload = {
  badge?: string;
  body: string;
  data?: Record<string, string | number | boolean>;
  icon?: string;
  tag?: string;
  title: string;
  topic?: string;
  url?: string;
};

export async function sendPushNotification(payload: PushPayload) {
  if (!isWebPushConfigured()) {
    throw new Error("Web push is not configured.");
  }

  configureWebPush();

  const subscriptions = (await getPushSubscriptions()).filter((record) => {
    if (!payload.topic) {
      return true;
    }

    return record.topics.includes(payload.topic);
  });
  const normalizedPayload = JSON.stringify({
    badge: "/pwa-icon-180.png",
    icon: "/pwa-icon-192.png",
    tag: "golden-edge-alert",
    url: "/vgk-updates",
    ...payload
  });

  const results = await Promise.allSettled(
    subscriptions.map((record) => webpush.sendNotification(record.subscription, normalizedPayload))
  );

  await Promise.all(
    results.map((result, index) => {
      if (result.status === "rejected") {
        const statusCode = result.reason?.statusCode;

        if (statusCode === 404 || statusCode === 410) {
          return removePushSubscription(subscriptions[index].endpoint);
        }
      }

      return Promise.resolve();
    })
  );

  return {
    failed: results.filter((result) => result.status === "rejected").length,
    sent: results.filter((result) => result.status === "fulfilled").length,
    total: subscriptions.length
  };
}
