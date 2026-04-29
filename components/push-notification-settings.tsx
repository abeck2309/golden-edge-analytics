"use client";

import { useEffect, useState } from "react";

type PushStatus =
  | "checking"
  | "unsupported"
  | "not-installed"
  | "not-configured"
  | "ready"
  | "subscribed"
  | "denied"
  | "error";

function isStandalonePwa() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export function PushNotificationSettings() {
  const [status, setStatus] = useState<PushStatus>("checking");
  const [message, setMessage] = useState("Checking this device...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function checkSupport() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        setMessage("This browser does not support web push notifications.");
        return;
      }

      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIos && !isStandalonePwa()) {
        setStatus("not-installed");
        setMessage("On iPhone, install Golden Edge to your Home Screen before enabling alerts.");
        return;
      }

      const keyResponse = await fetch("/api/push/public-key");
      const keyData = (await keyResponse.json()) as { configured: boolean; publicKey: string };

      if (!keyData.configured || !keyData.publicKey) {
        setStatus("not-configured");
        setMessage("Web push keys are not configured yet.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (Notification.permission === "denied") {
        setStatus("denied");
        setMessage("Notifications are blocked for this site in your browser settings.");
        return;
      }

      if (existingSubscription) {
        setStatus("subscribed");
        setMessage("VGK push alerts are enabled on this device.");
      } else {
        setStatus("ready");
        setMessage("Enable alerts for game starts, final scores, new articles, and breaking VGK news.");
      }

      await fetch("/api/push/subscribe");
    }

    checkSupport().catch(() => {
      setStatus("error");
      setMessage("Could not check notification support. Try refreshing the page.");
    });
  }, []);

  async function enableNotifications() {
    setBusy(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "ready");
        setMessage("Notification permission was not granted.");
        return;
      }

      const keyResponse = await fetch("/api/push/public-key");
      const keyData = (await keyResponse.json()) as { publicKey: string };
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
          userVisibleOnly: true
        }));

      const response = await fetch("/api/push/subscribe", {
        body: JSON.stringify({
          subscription,
          topics: ["vgk-updates", "game-start", "final-score", "articles", "breaking-news"]
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Subscription save failed.");
      }

      await response.json();
      setStatus("subscribed");
      setMessage("VGK push alerts are enabled on this device.");
    } catch {
      setStatus("error");
      setMessage("Could not enable push alerts. Check the web push configuration and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function disableNotifications() {
    setBusy(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          body: JSON.stringify({ endpoint: subscription.endpoint }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });
        await subscription.unsubscribe();
      }

      setStatus("ready");
      setMessage("Push alerts are off on this device.");
    } catch {
      setStatus("error");
      setMessage("Could not turn off push alerts. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendTestNotification() {
    setBusy(true);

    try {
      const response = await fetch("/api/push/test", { method: "POST" });

      if (!response.ok) {
        throw new Error("Test push failed.");
      }

      setMessage("Test alert sent. It should arrive shortly.");
    } catch {
      setStatus("error");
      setMessage("Could not send the test alert. Make sure push keys are configured.");
    } finally {
      setBusy(false);
    }
  }

  const canEnable = status === "ready" || status === "error";
  const canTest = status === "subscribed";
  const canDisable = status === "subscribed";

  return (
    <section className="panel p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Push Alerts</p>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white md:text-6xl">
            VGK Notifications
          </h1>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">{message}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:min-w-72">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Device Status</p>
          <p className="mt-3 text-2xl font-bold capitalize text-white">{status.replace("-", " ")}</p>
          <p className="mt-2 text-sm text-mist">Alerts for this device</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          disabled={!canEnable || busy}
          onClick={enableNotifications}
          className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-45"
        >
          Enable Alerts
        </button>
        <button
          type="button"
          disabled={!canTest || busy}
          onClick={sendTestNotification}
          className="rounded-xl border border-gold/40 px-5 py-3 text-sm font-bold text-gold-bright transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Send Test
        </button>
        <button
          type="button"
          disabled={!canDisable || busy}
          onClick={disableNotifications}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-mist transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Turn Off
        </button>
      </div>
    </section>
  );
}
