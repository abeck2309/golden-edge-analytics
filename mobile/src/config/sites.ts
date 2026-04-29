export const GOLDEN_EDGE_HOME_URL =
  process.env.EXPO_PUBLIC_GEA_SITE_URL ?? "https://goldenedgeanalytics-traderoi.vercel.app/";

export const PUSH_TOKEN_REGISTRATION_URL = process.env.EXPO_PUBLIC_PUSH_TOKEN_REGISTRATION_URL;

export const IN_APP_HOSTS = new Set([
  "goldenedgeanalytics-traderoi.vercel.app",
  "goldenedgeanalytics-quizzes.vercel.app",
  "goldenedgeanalytics-nhltradesim.vercel.app",
  "goldenedgeanalytics-lineupbuilder.vercel.app",
  "localhost",
  "127.0.0.1"
]);

export function isGoldenEdgeUrl(url: string) {
  try {
    const parsed = new URL(url);

    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? IN_APP_HOSTS.has(parsed.hostname)
      : false;
  } catch {
    return false;
  }
}
