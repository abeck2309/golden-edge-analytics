"use client";

import { useCallback, useEffect, useState } from "react";

type AutomatedAlertLogEntry = {
  body: string;
  failed: number;
  key: string;
  sent: number;
  sentAt: string;
  title: string;
  total: number;
  type: string;
};

const tokenStorageKey = "golden-edge-admin-notification-token";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

export function AutomatedAlertLog() {
  const [entries, setEntries] = useState<AutomatedAlertLogEntry[]>([]);
  const [message, setMessage] = useState("Loading automated alert log...");

  const loadLog = useCallback(async () => {
    const token = window.localStorage.getItem(tokenStorageKey);

    if (!token) {
      setMessage("Paste your admin token above, then refresh the log.");
      setEntries([]);
      return;
    }

    const response = await fetch("/api/admin/notifications/automated-log", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      setMessage("Could not load automated alert log.");
      setEntries([]);
      return;
    }

    const data = (await response.json()) as { entries: AutomatedAlertLogEntry[] };
    setEntries(data.entries);
    setMessage(data.entries.length ? "Latest automated notifications sent." : "No automated notifications have been sent yet.");
  }, []);

  useEffect(() => {
    loadLog();
  }, [loadLog]);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">Automated alert log</p>
          <p className="mt-2 text-sm leading-6 text-mist">{message}</p>
        </div>
        <button
          type="button"
          onClick={loadLog}
          className="rounded-xl border border-gold/40 px-4 py-2 text-sm font-bold text-gold-bright transition hover:bg-gold/10"
        >
          Refresh
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {entries.map((entry) => (
          <article key={`${entry.key}-${entry.sentAt}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">{entry.title}</p>
                <p className="mt-1 text-sm leading-6 text-mist">{entry.body}</p>
              </div>
              <span className="w-fit rounded-full border border-gold/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gold-bright">
                {entry.type}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-mist">
              <span>{formatDate(entry.sentAt)}</span>
              <span>Sent: {entry.sent}</span>
              <span>Failed: {entry.failed}</span>
              <span>Total: {entry.total}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
