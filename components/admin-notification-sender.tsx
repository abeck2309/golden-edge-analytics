"use client";

import { FormEvent, useEffect, useState } from "react";

const tokenStorageKey = "golden-edge-admin-notification-token";

type SendState = {
  message: string;
  status: "idle" | "sending" | "success" | "error";
};

export function AdminNotificationSender() {
  const [adminToken, setAdminToken] = useState("");
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("/vgk-updates");
  const [state, setState] = useState<SendState>({
    message: "Enter your admin token and compose a notification.",
    status: "idle"
  });

  useEffect(() => {
    setAdminToken(window.localStorage.getItem(tokenStorageKey) ?? "");
  }, []);

  function saveToken(nextToken: string) {
    setAdminToken(nextToken);
    window.localStorage.setItem(tokenStorageKey, nextToken);
  }

  async function sendNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ message: "Sending notification...", status: "sending" });

    try {
      const response = await fetch("/api/admin/notifications/send", {
        body: JSON.stringify({
          body,
          title,
          url
        }),
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      const data = (await response.json()) as { error?: string; failed?: number; sent?: number; total?: number };

      if (!response.ok) {
        throw new Error(data.error ?? "Notification send failed.");
      }

      setState({
        message: `Sent to ${data.sent ?? 0} device${data.sent === 1 ? "" : "s"}. Failed: ${data.failed ?? 0}.`,
        status: "success"
      });
      setBody("");
      setTitle("");
    } catch (error) {
      setState({
        message: error instanceof Error ? error.message : "Notification send failed.",
        status: "error"
      });
    }
  }

  return (
    <section className="panel p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white md:text-6xl">
          Send Push Notification
        </h1>
        <p className="mt-4 text-sm leading-7 text-mist md:text-base">
          Send a custom alert to subscribed Golden Edge devices.
        </p>
      </div>

      <form onSubmit={sendNotification} className="mt-8 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Admin Token</span>
          <input
            value={adminToken}
            onChange={(event) => saveToken(event.target.value)}
            type="password"
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-gold/60"
            placeholder="Paste ADMIN_NOTIFICATION_TOKEN"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-gold/60"
            placeholder="Breaking VGK News"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Message</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-32 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-gold/60"
            placeholder="Write the notification message..."
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Open URL</span>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-gold/60"
            placeholder="/vgk-updates"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={state.status === "sending"}
            className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state.status === "sending" ? "Sending..." : "Send Notification"}
          </button>
          <p
            className={
              state.status === "error"
                ? "text-sm font-semibold text-red-300"
                : state.status === "success"
                  ? "text-sm font-semibold text-gold-bright"
                  : "text-sm text-mist"
            }
          >
            {state.message}
          </p>
        </div>
      </form>
    </section>
  );
}
