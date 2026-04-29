import { NextResponse } from "next/server";

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";

  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return request.headers.get("x-admin-token") ?? "";
}

export function isAdminRequest(request: Request) {
  const expectedToken = process.env.ADMIN_NOTIFICATION_TOKEN;

  return Boolean(expectedToken && getBearerToken(request) === expectedToken);
}

export function unauthorizedJson() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function isCronRequest(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret && process.env.NODE_ENV !== "production") {
    return true;
  }

  return Boolean(expectedSecret && getBearerToken(request) === expectedSecret);
}
