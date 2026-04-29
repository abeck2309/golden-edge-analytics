import { NextResponse } from "next/server";

import { isAdminRequest, unauthorizedJson } from "@/lib/admin-auth";
import { getAutomatedAlertLog } from "@/lib/push-alert-state";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorizedJson();
  }

  return NextResponse.json({
    entries: await getAutomatedAlertLog(),
    ok: true
  });
}
