import { Platform } from "react-native";

import { PUSH_TOKEN_REGISTRATION_URL } from "../config/sites";

export type RemoteAlertType = "game-start" | "final-score" | "new-update" | "breaking-news";

export async function registerPushTokenWithBackend(token: string) {
  if (!PUSH_TOKEN_REGISTRATION_URL) {
    return { skipped: true };
  }

  const response = await fetch(PUSH_TOKEN_REGISTRATION_URL, {
    body: JSON.stringify({
      platform: Platform.OS,
      token,
      topics: ["vgk-updates", "game-alerts", "articles", "breaking-news"]
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Push token registration failed with status ${response.status}`);
  }

  return { skipped: false };
}
